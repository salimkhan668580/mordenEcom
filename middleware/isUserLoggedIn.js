const redis= require('../helper/redis')
const jwt = require("jsonwebtoken");
exports.isUserLoggedIn = async(req, res, next) => { 
    try {

      const token = req.cookies?.token || req.headers?.authorization;
        if(!token){
            return res.status(401).json({status:false,message:"Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.user.role !== "user") {
            return res.status(401).json({status:false,message:"Unauthorized"});
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log("error in  user middleware",error)
        res.status(500).json({message:"Internal server error"})
        
    }

}