const z=require('zod')
const { ObjectId } = require("mongodb");

exports.createProduct=z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
   
    stock: z.number(),
    image: z.array(z.string()),
    category: z.string(),
})
exports.editProduct=z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    productId:z.string(),
    stock: z.number(),
    image: z.array(z.string()),
    category: z.string(),
})


exports.deleteProduct = z.object({
  productId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid product ID format",
  }),
});