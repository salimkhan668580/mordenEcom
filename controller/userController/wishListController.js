const WishList=require("../../models/wishList")
const {ObjectId}=require('mongodb')


exports.AddToWishList = async (req, res) => {
  try {
    const { _id } = req.user; 
    const { items } = req.body;
 if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required" });
    }
    const wishlist=await WishList.findOne({userId:_id})
    if(!wishlist){
        const newWishList=await WishList.create({
            userId:_id,
            items
        })
        await newWishList.save();
         return res.status(201).json({
             success: true,
             message: "Wishlist created successfully",
             wishlist: newWishList,
           });
        }

  const newItems = [];

    for (const item of items) {
      const alreadyExists = wishlist.items.some(
        (wish) => wish.productId.toString() === item.productId.toString()
      );

      if (!alreadyExists) {
        newItems.push(item);
      }
    }

    if (newItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Product already exists in wishlist",
     
      });
    }
     wishlist.items.push(...newItems);
    await wishlist.save();
 
    return res.status(200).json({
      success: true,
      message: "Add to wishlist successful",
      
    });


   



  } catch (error) {
    console.log("Error in AddToWishList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.DeleteToWishList = async (req, res) => {
  try {
    const { _id } = req.user; 
    const { items } = req.body;
 if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required" });
    }
    const wishlist=await WishList.findOne({userId:_id})
    if(!wishlist){
      
         return res.status(401).json({
             success: false,
             message: "Wishlist not found",
           });
        }

 for (const removeItem of items) {
      wishlist.items = wishlist.items.filter(
        (wish) => wish.productId.toString() !== removeItem.productId.toString()
      );
    }
    if(wishlist.items.length===0){
        wishlist.items=undefined
    }
    await wishlist.save();
    
 return res.status(200).json({
      success: true,
      message: "Product(s) removed from wishlist successfully",
    });


  } catch (error) {
    console.log("Error in AddToWishList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getToWishList = async (req, res) => {
  try {
    const { _id } = req.user; 
    
    const wishlistAggregate=await WishList.aggregate([
        {
            $match:{userId:new ObjectId(_id)}
        },
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userDetails",
              
            }

        },
        {
            $unwind:"$userDetails"
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
    $project: {
      "userDetails.password": 0,
      "userDetails.__v": 0,
      userId: 0,
      "userDetails.role": 0,
      items: 0,
      __v: 0
    }
  }
    ])



 return res.status(200).json({
      success: true,
      message: "wishlist fetched successfully",
      data:wishlistAggregate
    });


   


  
    await wishlist.save();
 
    return res.status(200).json({
      success: true,
      message: "Add to wishlist successful",
      
    });


   



  } catch (error) {
    console.log("Error in AddToWishList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
