
const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController/userController');
const zodSchema=require("../helper/zodSchema")
const zodSchemaValidator = require('../middleware/zodSchemaValidator');
const isUserLoggedIn=require('../middleware/isUserLoggedIn')

userRouter.post("/register",zodSchemaValidator(zodSchema.userRegistration), userController.userRegister)
userRouter.post("/admin/login",zodSchemaValidator(zodSchema.AdminLogin), userController.adminLogin)
userRouter.post("/login",zodSchemaValidator(zodSchema.AdminLogin), userController.userLogin)
userRouter.use(isUserLoggedIn.isUserLoggedIn)
userRouter.put("/",zodSchemaValidator(zodSchema.userRegistration), userController.EditProfile)



module.exports = userRouter;
