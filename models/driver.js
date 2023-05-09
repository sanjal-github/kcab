const mongoose = require("mongoose");
// This is the Driver Schema 
const driverSchema = new mongoose.Schema({
    _id:
    {
        type:String,

    },
    name:
    {
        type:String,
        required:true
    },
    address:
    {
        type:String,
        required:true
    },
    mobile:
    {
        type:String,
        required:true,
    },
    birth_date:
    {
        type:Date,
        require:true
    },
    gender:
    {
        type:String,
        required:true
    },
    photo:
    {
        type:String,
        required:true
    },
    liscence_number:
    {
        type:String,
        required:true,
        unique:true
    },
    working:
    {
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
})

const driver = new mongoose.model("driver",driverSchema);
module.exports = driver ;
