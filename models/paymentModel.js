const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentGatewayId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'failed']
    },
    transactionId: {
        type: String,
        required: true
    }

},{timestamps: true});

module.exports = mongoose.model('Payment', paymentSchema);
