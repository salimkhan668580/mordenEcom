const mongoose =require('mongoose');
// {
//   _id,
//   name,
//   description,
//   price,
//   stock,
//   images: [url],
//   category,
//   ratings: [{ userId, rating, comment }],
//   avgRating,
//   createdAt
// }

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    image:[
        {
            type: String,
            required: true
        }
    ],
    category:{
        type: String,
        required: true
    },
    ratings:[{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    avgRating: {
        type: Number,
        default: 0
    },
 
},{timestamps: true});
module.exports = mongoose.model("Product",productSchema);