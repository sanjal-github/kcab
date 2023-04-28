const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    _id:
    {
        type:Number,
        require:true
    },
    userId:
    {
        type:Number,
        
    },
    otp:
    {
        type:String,
        required:true 
    },
    status:
    {
        type:Boolean,
        default:false  
    },
    createdAt:
    {
        type:Date
    },
    expiresAt:
    {
        type:Date
    }

})

const otpVerify = new mongoose.model("UserOtp",UserOTPVerificationSchema);
module.exports = otpVerify;
