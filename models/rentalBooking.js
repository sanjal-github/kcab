const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId
const rentalCabSchema = new mongoose.Schema({
    _id:
    {
        type: String,
    },
    user_id:
    {
        type: String,
        required: true
    },
    seater_type:
    {
        type:Number,
    },
    rental_Hours:
    {
        type: Number,
        required: true,
    },
    rental_date:
    {
        type: Date,
        required: true
    },
    rental_time:
    {
        type: String,
        required: true
    },
    start_price:
    {
        type: Number,
        required: true
    },
    status:
    {
        type: Boolean,
        default: true
    },
    vehicle_no:
    {
        type:String
    }
},
    {
        timestamps: true
    });

rentalCabSchema.index({ location: "2dsphere" });
let rentalCab = new mongoose.model("rentalCab", rentalCabSchema);
module.exports = rentalCab;
