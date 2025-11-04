

const mongoose =require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: [{
        street: String,
        city: String,
        state: String,
        pin: Number
    }],
   
},{timestamps: true});
module.exports = mongoose.model('User', userSchema);