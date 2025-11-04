
const AdminOtp=require('../../models/adminOtp')
const helper=require('../../helper/helper')
const User=require('../../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const radis=require('../../helper/redis')

exports.sendOtp=async(req,res)=>{   

    try {
        const {email}=req.body
       const admin=await User.findOne({email:email,role:"admin"})
       if(!admin){
        return res.status(400).json({message:"Admin not found"})
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
        res.status(200).json({message:"Otp sent successfully",otp:otp})


    }catch (error) {
        console.log("error in otp sending",error)
        res.status(500).json({message:"Internal server error"}) 
    }
     
}

exports.verifyOtp=async(req,res)=>{   

    try {
        const {email,otp}=req.body
       const admin=await User.findOne({email:email,role:"admin"})
       if(!admin){
        return res.status(400).json({message:"Admin not found"})
       }
         
       const adminOtp=await AdminOtp.findOne({email:email})
     if (!adminOtp) {
  return res.status(400).json({
    success: false,
    message: "No OTP found. Please request a new one.",
  });
}
  const RedisOtp=await radis.get(email)
if (RedisOtp != otp || adminOtp.otp != otp) {
  return res.status(400).json({
    success: false,
    message: "Incorrect OTP. Please try again.",
  });
}

if (adminOtp.isVarified) {
  return res.status(400).json({
    success: false,
    message: "This OTP has already been used or expired.",
  });
}

       adminOtp.isVarified=true
       await adminOtp.save()
       const token = jwt.sign(
            { user: admin},
            process.env.JWT_SECRET,
  { expiresIn: 60 * 60 * 24 }
);

     res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",         
    maxAge: 24 * 60 * 60 * 1000, 
  });
        res.status(200).json({
            success:true,
            message:"Login successfully",
            token
          })
    }catch (error) {
        console.log("error in otp sending",error)
        res.status(500).json({message:"Internal server error"}) 
    }
     
}

exports.changePwd=async(req,res)=>{   
    try {
        const {email,oldPwd,newPwd}=req.body
        const admin=await User.findOne({email:email,role:"admin"})
        if(!admin){
          return res.status(400).json({message:"Admin not found"})
        }
       
        const isMatch=await bcrypt.compare(oldPwd,admin.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
        const hasPwd=await bcrypt.hash(newPwd, 10);
        admin.password=hasPwd
        await admin.save()
        res.status(200).json({message:"Password changed successfully"})
}catch (error) {
        console.log("error in otp sending",error)
        res.status(500).json({message:"Internal server error"}) 
    }
    
}
