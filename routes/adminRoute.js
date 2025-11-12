const express=require('express')
const adminRouter=express.Router()
const adminController=require('../controller/adminController/adminController')
const zodSchema=require("../helper/zodSchema")
const zodSchemaValidator = require('../middleware/zodSchemaValidator');


// =======use =====
adminRouter.put("/user-delete",zodSchemaValidator(zodSchema.mongooseId), adminController.deleteUser)
adminRouter.get("/users-order", adminController.getAllOrders)

module.exports=adminRouter