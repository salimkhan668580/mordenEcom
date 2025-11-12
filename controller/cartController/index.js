
const cartModal=require('../../models/cartModel')
const Product = require(".././../models/productModel");
const {ObjectId} =require('mongodb')
const WishList=require('../../models/wishList')
const radis=require('../../helper/redis')


// ===========cart logic=========
exports.AddToCart = async (req, res) => {
  try {
    const { _id } = req.user; 
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required" });
    }

 
    let cart = await cartModal.findOne({ userId: _id });

    if (!cart) {
 
      let totalPrice = 0;
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
        totalPrice += product.price * item.qty;
      }
 const finalItem=[]
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
        finalItem.push({productId:item.productId,qty:item.qty,price:product.price})
      }


      const newCart = await cartModal.create({
        userId: _id,
        items:finalItem,
        totalPrice,
      });

      return res.status(201).json({
        success: true,
        message: "Cart created successfully",
        cart: newCart,
      });
    }

   
    for (const newItem of items) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === newItem.productId
      );
      if (existingItem) {
        existingItem.qty += newItem.qty; 
      } else {
        cart.items.push(newItem); 
      }
    }


    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      total += product.price * item.qty;
    }
    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Add to cart successful",
      cart,
    });
  } catch (error) {
    console.log("Error in AddToCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.RemoveToCart = async (req, res) => {
  try {
    const { _id } = req.user; 
    const { productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }


    const cart = await cartModal.findOne({ userId: _id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }


    if (qty <= 0) {
      cart.items.splice(itemIndex, 1); 
    } else {
      cart.items[itemIndex].qty = qty;
    }

    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      total += product.price * item.qty;
    }
    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message:
        qty <= 0
          ? "Item removed from cart"
          : "Item quantity updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllCartItems=async(req,res)=>{  
    try {
        const{_id}=req.user
        if(!_id){
            return res.status(400).json({success:false,message:"User not found"})
        }
        if(await radis.get(`cartItems&${_id}`)){
            const cartAggregation=JSON.parse(await radis.get(`cartItems&${_id}`))
            return res.status(200).json({success:true,message:"Cart items fetched successfully from redis",cartAggregation})
        }
        const cartAggregation=await cartModal.aggregate([
            {
                $match:{userId:new ObjectId(_id)}
            },
             {
                $lookup:{
                    from:"products",
                    localField:"items.productId",
                    foreignField:"_id",
                    as:"productDetails",

                }
             },
          {
            $project:{
                items:0
            }
          }



            
        ])
         
        await radis.set(`cartItems&${_id}`,JSON.stringify(cartAggregation),{EX: 100})
        return res.status(200).json({success:true,message:"Cart items fetched successfully from database",cartAggregation})

   
    } catch (error) {
        console.log("error in getting cart items",error)
        res.status(500).json({message:"Internal server error"})
    }
}




  