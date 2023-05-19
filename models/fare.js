const mongoose = require("mongoose");
const fareSchema = new mongoose.Schema({
    _id:
    {
        type:String,
    },
    seater_type:
    {
        type:Number,
        required:true
    },
    fuel_type:
    {
        type:String,
        required:true
    },
    rental_fare:
    {
        type:Number,
        required:true
    },
    ride_fare:
    {
        type:Number,
        required:true
    },
    tour_fare:
    {
        type:Number,
        required:true
    }
},
{
    timestamps:true
});
const fare = new mongoose.model("fares",fareSchema);
module.exports = fare ; 
