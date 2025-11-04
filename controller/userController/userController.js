const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminOtp=require('../../models/adminOtp')
const helper=require('../../helper/helper')
const radis=require('../../helper/redis')
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

exports.userLogin=async(req,res)=>{
    try {
        
        
    } catch (error) {

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
        const user=await userModel.findOne({email:email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
            const token = jwt.sign(
            { user: user},
            process.env.JWT_SECRET,
  { expiresIn: 60 * 60 * 24 }
);
        res.status(200).json({message:"Login successful", user,token})    

    } catch (error) {
     console.log(error)
        res.status(500).json({message:"Internal server error"}) 
    }
}



