const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminOtp=require('../../models/adminOtp')
const cartModal=require('../../models/cartModel')
const helper=require('../../helper/helper')
const radis=require('../../helper/redis');
const orderModal=require('../../models/orderModel')
const productModel=require('../../models/productModel')

require('dotenv').config();

exports.userRegister=async(req,res)=>{

    try {

        if(!req.body){
            res.status(400).json({message:"Invalid request body"})
        }

        const user=await userModel.findOne({email:req.body.email})
        if(user){
           return res.status(400).json({message:"User already exists"})
        }

        if(!req.body.password){
           return res.status(400).json({message:"Password is required"})

        }
        const hasPwd=await bcrypt.hash(req.body.password, 10);
        const data={...req.body,password:hasPwd}
        const newUser=new userModel(data);
        await newUser.save()
      return  res.status(200).json({message:"User registered successfully",user:newUser})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
        
    }

  
}
exports.EditProfile=async(req,res)=>{
    const {userId,password,role,...payload}=req.body

    try {
        const user=await userModel.findByIdAndUpdate(userId,payload, { new: true });
        if(!user){
           return res.status(400).json({success:false,message:"User not found"})
        }

      
      return  res.status(200).json({success:true ,message:"User Edit successfully",user})
    } catch (error) {
        console.log("error in editing profile",error)
        res.status(500).json({message:"Internal server error"})
        
    }

  
}


exports.adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email:email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
        const otp=helper.generateOtp()
        
       const adminOtp=await AdminOtp.findOne({email:email})
       if(adminOtp){
        
        await radis.set(email,otp,{EX: 300})
        adminOtp.otp=otp

        adminOtp.isVarified=false
        await adminOtp.save()
        return res.status(200).json({message:"Otp sent successfully",email:email,otp:otp})
       }

        const  optStore=new AdminOtp({email:email,otp:otp})
        await optStore.save()
        await radis.set(email,otp,{EX: 300})
            
      return res.status(200).json({message:"Otp sent successfully",email:email,otp:otp})   

    } catch (error) {
     console.log(error)
        res.status(500).json({message:"Internal server error"}) 
    }
}

exports.userLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email:email,role:"user"})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found please register"
            })
        }
        if(user.isDeleted===true){
            return res.status(400).json({
                success:false,
                message:"User Account Has been deleted form admin please connect with admin"
            })
            
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
        user.isActive=true;
        await user.save()
            const token = jwt.sign(
            { user: user},
            process.env.JWT_SECRET,
  { expiresIn: 60 * 60 * 24 }
);

 res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",         
    maxAge: 24 * 60 * 60 * 1000, 
  });
await radis.set(user.email,token,{EX: 500})
 res.status(200).json({message:"Login successful", user,token})    
    } catch (error) {
     console.log(error)
        res.status(500).json({message:"Internal server error"}) 
    }
}

exports.deActivate=async(req,res)=>{
     const {_id}=req.user

     if(!_id){
        return res.status(400).json({success:false,message:"User not found"})
     }

    try {
        const updateData={
            isActive:false,
            deactivatedAt:new Date()
        }
        const user=await userModel.findByIdAndUpdate(_id,updateData, { new: true });
        if(!user){
           return res.status(400).json({success:false,message:"User not found"})
        }

      
      return  res.status(200).json({success:true ,message:"User Edit successfully",user})
    } catch (error) {
        console.log("error in editing profile",error)
        res.status(500).json({message:"Internal server error"})
        
    }

  
}

// ======order place===========
exports.orderPlace=async(req,res)=>{
    
    try {
        const {_id}=req.user
        const {deleveryAddress,paymentMethod,paymentStatus}=req.body
        if(!_id){
            return res.status(400).json({success:false,message:"User not found"})
        }

        const cart=await cartModal.findOne({userId:_id})
        if(!cart){
            return res.status(400).json({success:false,message:"Cart not found"})
        }

        if(cart.items.length===0){
            return res.status(400).json({success:false,message:"Cart is empty"})
        }

        for(const item of cart.items){
            const product=await productModel.findById(item.productId)
            if(!product){
                return res.status(400).json({success:false,message:`Product ${item.productId} not found`})
            }
            if(product.stock<item.qty){
                return res.status(400).json({success:false,message:`Product ${item.productId} is out of stock`})
            }
            product.stock=product.stock-item.qty
            await product.save()
        }

        
        const order=new orderModal({userId:_id,deleveryAddress,paymentMethod,paymentStatus,items:cart.items,totalPrice:cart.totalPrice})
        await order.save()
        await cartModal.deleteOne({userId:_id})
        return res.status(200).json({success:true,message:"Order placed successfully",order})
    } catch (error) {
        console.log("error in order place",error)
        
    }
}




