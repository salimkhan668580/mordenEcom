
const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController/userController');
const zodSchema=require("../helper/zodSchema")
const zodSchemaValidator = require('../middleware/zodSchemaValidator');

userRouter.post("/register",zodSchemaValidator(zodSchema.userRegistration), userController.userRegister)
userRouter.post("/admin/login",zodSchemaValidator(zodSchema.AdminLogin), userController.adminLogin)
userRouter.post("/login",zodSchemaValidator(zodSchema.AdminLogin), userController.userLogin)



module.exports = userRouter;
