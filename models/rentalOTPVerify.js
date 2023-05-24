const mongoose = require("mongoose");

const rentalOTPVerifySchema = new mongoose.Schema({
    _id:
    {
        type:String,

    },
    rental_id:
    {
        type:String,
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
    book_status:
    {
        type:String,
        enum:["booked","completed","running","cancelled"],
        default:"booked"
    },
    createdAt:
    {
        type:Date,
        default:Date.now()
    },
    expiresAt:
    {
    type:Date,
    default:Date.now()+3600
    },
    verifyAt:
    {
        type:Date,
        default:Date.now()
    },

},
{
    timestamps:true
});

const rentalOTP = new mongoose.model("rentalOTPVerify", rentalOTPVerifySchema);
module.exports = rentalOTP;

