const express = require('express');
const productRouter = express.Router();
const productController = require('../controller/productController/productController');
const productSchema=require('../helper/zodSchema/productSchema')
const zodSchemaValidator=require('../middleware/zodSchemaValidator')
const isAdminLoggedIn=require('../middleware/isAdminLoggedIn')




// productRouter.get("/:id",zodSchemaValidator(zodSchema.userRegistration), userController.userRegister)
productRouter.get("/",productController.getAllProducts)

productRouter.use(isAdminLoggedIn.isAdminLoggedIn)
productRouter.post("/",zodSchemaValidator(productSchema.createProduct), productController.createProduct)
productRouter.delete("/",zodSchemaValidator(productSchema.deleteProduct), productController.deteleProduct)
productRouter.put("/",zodSchemaValidator(productSchema.editProduct), productController.editProduct)
// productRouter.delete("/:id",zodSchemaValidator(zodSchema.AdminLogin), userController.userLogin)


module.exports = productRouter;