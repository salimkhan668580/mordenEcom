const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'CARD',"UPI","NETBANKING"],
  
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
      
    },
    deleveryAddress: {
        fullAddress: {
            type: String,
            required: true
        },
       city:{
           type: String,
           required: true
       },
       state:{
           type: String,
           required: true
       },
       pin:{
           type: Number,
           required: true
       } 

    },
},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
