const ProductModel=require('../../models/productModel')

const radis=require("../../helper/redis")

exports.createProduct=async(req,res)=>{
    try {
        const newProduct=await ProductModel.create(req.body)
        await newProduct.save()
        res.status(200).json({success:true,message:"Product created successfully",product:newProduct})  
    } catch (error) {
        console.log("error in creating product",error)
        res.status(500).json({success:false,message:"Internal server error"})
        
    }
    
}

exports.editProduct=async(req,res)=>{
    try {
      const product=await ProductModel.findByIdAndUpdate(req.body.productId,req.body, { new: true });
      if(!product){
        return res.status(400).json({success:false,message:"Product not found"})
      }


     
        res.status(200).json({success:true,message:"Product updated successfully",product})  
    } catch (error) {
        console.log("error in creating product",error)
        res.status(500).json({success:false,message:"Internal server error"})
        
    }
    
}
exports.productDetails=async(req,res)=>{
  const {productId}=req.query
    try {
      const product=await ProductModel.findById(productId)
      if(!product){
        return res.status(400).json({success:false,message:"Product not found"})
      }

     
        res.status(200).json({success:true,message:"Product updated successfully",product})  
    } catch (error) {
        console.log("error in creating product",error)
        res.status(500).json({success:false,message:"Internal server error"})
        
    }
    
}
exports.getAllProducts = async (req, res) => {
  try {
    let { page, 
      limit,
      search,
      price_order,
      brand,
      rating,
      category,
      productId

     } = req.query;

    if(productId){
      const product=await ProductModel.findById(productId)
      if(!product){
        return res.status(400).json({success:false,message:"Product not found"})
      }
      return res.status(200).json({success:true,message:"Product fetched successfully",product})  
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;


    const skip = (page - 1) * limit;
    const radisData=await radis.get(`productList&${page}&${limit}&${search}&${price_order}&${brand}&${rating}`)

    if(radisData){
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully from radis",
        data: JSON.parse(radisData),
      });
    }

    const matchQuery = {};
const sortQuery={}
  sortQuery.price=price_order==="asc"?1:-1

 
    if(category){
      matchQuery.category=category
    }
    if (brand) {
      matchQuery.brand = brand
    }
    if (rating) {
      matchQuery.avgRating = { $gte: rating }
    }
    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }
    const productAggregate = await ProductModel.aggregate([
      { $match: matchQuery },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit },
    ]);


    const totalDocuments = await ProductModel.countDocuments(matchQuery);


    const pagination = {
      totalDocuments,
       page,
       limit,
      totalPages: Math.ceil(totalDocuments / limit),
    };

 await radis.set(`productList&${page}&${limit}`,JSON.stringify({
   success: true,
      message: "Products fetched successfully in radis",
      data: productAggregate,
      pagination,
 }),{EX: 300})

    res.status(200).json({
      success: true,
      message: "Products fetched successfully from database",
      data: productAggregate,
      pagination,
    });
  } catch (error) {
    console.error("Error in fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


exports.deteleProduct=async(req,res)=>{
  const {productId}=req.body
  try {
    const product=await ProductModel.findByIdAndDelete(productId)
    if(!product){
      return res.status(400).json({success:false,message:"Product not found"})
    }
    res.status(200).json({success:true,message:"Product deleted successfully"})  
  } catch (error) {
    console.log("error in deleting product",error)
    res.status(500).json({success:false,message:"Internal server error"})
    
  }

}
