const express = require('express');
const commonRouter = express.Router();

const commonController=require("../controller/commonController")


commonRouter.post("/",commonController.uploadImages)


module.exports = commonRouter;