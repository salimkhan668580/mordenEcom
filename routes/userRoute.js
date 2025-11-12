
const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController/userController');
const zodSchema=require("../helper/zodSchema")
const productSchema=require("../helper/zodSchema/productSchema")
const zodSchemaValidator = require('../middleware/zodSchemaValidator');
const isUserLoggedIn=require('../middleware/isUserLoggedIn')
const cartController=require('../controller/cartController')
const wishListController=require('../controller/userController/wishListController')

userRouter.post("/register",zodSchemaValidator(zodSchema.userRegistration), userController.userRegister)
userRouter.post("/admin/login",zodSchemaValidator(zodSchema.AdminLogin), userController.adminLogin)
userRouter.post("/login",zodSchemaValidator(zodSchema.AdminLogin), userController.userLogin)
userRouter.use(isUserLoggedIn.isUserLoggedIn)

// ============user profile and accounts===================
userRouter.put("/",zodSchemaValidator(zodSchema.userRegistration), userController.EditProfile)
userRouter.put("/deActivate", userController.deActivate)


// ===========user Product related=========================

userRouter.get("/cart", cartController.getAllCartItems)
userRouter.post("/add-to-cart",zodSchemaValidator(productSchema.addToProduct), cartController.AddToCart)
userRouter.post("/remove-to-cart",zodSchemaValidator(productSchema.removeToCart), cartController.RemoveToCart)


//wishlist
userRouter.get("/wishlist", wishListController.getToWishList)
userRouter.post("/Add-to-wishlist",zodSchemaValidator(productSchema.addToWishList), wishListController.AddToWishList)
userRouter.post("/delete-to-wishlist",zodSchemaValidator(productSchema.addToWishList), wishListController.DeleteToWishList)


// order place 
userRouter.post("/order-place",zodSchemaValidator(productSchema.orderSchema), userController.orderPlace)



module.exports = userRouter;
