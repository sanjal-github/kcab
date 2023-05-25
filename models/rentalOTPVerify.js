const mongoose = require("mongoose");

const rentalOTPVerifySchema = new mongoose.Schema({
    _id:
    {
        type: String,

    },
    rental_id:
    {
        type: String,
    },
    otp:
    {
        type: String,
        required: true
    },
    status:
    {
        type: Boolean,
        default: false
    },
    book_status:
    {
        type: String,
        enum: ["booked", "completed", "running", "cancelled","otp_expires"],
        default: "booked"
    },
    createdAt:
    {
        type: Date,

    },
    expiresAt:
    {
        type: Date,
    },
    verifyAt:
    {
        type: Date,

    },

});

const rentalOTP = new mongoose.model("rentalOTPVerify", rentalOTPVerifySchema);
module.exports = rentalOTP;

