const z=require('zod')


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

