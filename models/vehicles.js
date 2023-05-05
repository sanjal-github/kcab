const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    _id:
    {
        type: Sṭring,
        required: true
    },
    rto_no:
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
        required: true
    },
    seater_type:
    {
        type: String,
    },
    price:
    {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

let vehicle = new mongoose.model("vehicles", vehicleSchema);

module.exports = vehicle;