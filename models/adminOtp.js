const mongoose = require("mongoose");

const otpSchema= mongoose.Schema({
    email: String,
    otp: String,
    isVarified:{
        type: Boolean,
        default: false
    },
   createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

module.exports = mongoose.model("AdminOtp", otpSchema);