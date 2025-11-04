const express = require('express');
const authRouter = express.Router();
const userController = require('../controller/userController/userController');
const adminController = require('../controller/adminController/adminController');
const zodSchema=require("../helper/zodSchema")

const zodSchemaValidator = require('../middleware/zodSchemaValidator');

authRouter.post("/send-otp",zodSchemaValidator(zodSchema.sendOpt), adminController.sendOtp)
authRouter.post("/verify-otp",zodSchemaValidator(zodSchema.verifyOpt), adminController.verifyOtp)
authRouter.post("/change-pwd",zodSchemaValidator(zodSchema.changeAdminPassword), adminController.changePwd)

module.exports = authRouter;