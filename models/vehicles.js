const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema({
    _id:
    {
        type:String,
        required: true
    },
    vehicle_no:
    {
        type: String,
        required: true,
        unique: true
    },
    name:
    {
        type: String,
        required: true,
        default: ""
    },
    brand:
    {
        type: String,
        required: true,
        default: ""
    },
    model:
    {
        type: String,
        required: true,
    },
    color:
    {
        type: String,
        required: true
    },
    fuel_type:
    {
        type: String,
        enum:["petrol","diesel","electric","cng"],
        required: true
    },
    seater_type:
    {
        type:Number,
    },
    image:{
        type:String,
        default:""
    },
    price:
    {
        type: String,
        required: true
    },
    status:
    {
        type:String,
        enum:["active","deactive"],
        default:"active"
    },
    booking_status:
    {
        type:Boolean,
        default:false
    },
},
    {
        timestamps: true
    });

let vehicle = new mongoose.model("vehicles", vehicleSchema);
module.exports = vehicle;