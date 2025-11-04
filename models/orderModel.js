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
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
        required: true
    },
    address: {
        type: String,
        required: true
    },

},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
