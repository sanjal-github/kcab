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
        enum:["petrol","diesel","electric","cng"],
        required:true
    },
    fare:
    {
        type:Number,
        required:true
    },
    per_hours:
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
