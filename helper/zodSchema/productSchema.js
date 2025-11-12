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

exports.addToProduct = z.object({
  items: z.array(
    z.object({
      productId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Invalid product ID format",
      }),
      qty: z.number()
    })
  ),
});

exports.removeToCart = z.object({
  productId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid product ID format",
  }),
  qty: z.number(),
});

exports.addToWishList = z.object({
  items: z.array(
    z.object({
      productId: z.string().refine((val) => ObjectId.isValid(val), {
        message: "Invalid product ID format",
      }),
      addedAt: z.date().optional(),

    })
  ),
});

exports.orderSchema = z.object({
  deleveryAddress: z.object({
    fullAddress: z.string({
      required_error: "Full address is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),
    state: z.string({
      required_error: "State is required",
    }),
    pin: z
      .number({
        required_error: "PIN code is required",
      })
      .refine((val) => val.toString().length === 6, {
        message: "PIN must be 6 digits",
      }),
  }),

  paymentMethod: z.enum(["COD", "CARD", "UPI", "NETBANKING"], {
    required_error: "Payment method is required",
  }),

  paymentStatus: z.enum(["pending", "shipped", "delivered"], {
    required_error: "Payment status is required",
  }),
});


