const ProductModel=require('../../models/productModel')



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
exports.getAllProducts = async (req, res) => {
  try {
    let { page, limit,search } = req.query;

    // ✅ Convert to numbers and set defaults
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const skip = (page - 1) * limit;

    // ✅ Optional match (you can add filters later)
    const matchQuery = {};

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }

    // ✅ Aggregation pipeline
    const productAggregate = await ProductModel.aggregate([
      { $match: matchQuery },
      { $skip: skip },
      { $limit: limit },
    ]);

    // ✅ Count total documents
    const totalDocuments = await ProductModel.countDocuments(matchQuery);

    // ✅ Pagination info
    const pagination = {
      totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    };

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
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
