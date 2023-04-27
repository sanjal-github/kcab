const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    _id:
    {
        type:Number,
        unique:true,
        required:true
    },
    name:
    {
        type:String,
        required:true
    },
    email:
    {
       type:String,
       required:true,
       unique:true 
    },
    phone:
    {
        type:String,
        required:true,
    }
},
{
    timestamps:true
}
)

