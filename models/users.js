const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    _id:
    {
        type:Number,
        //unique:true,
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
    },
    status:
    {
        type:String,
        default:"New"
    }

},
{
    timestamps:true
}
)

const user = new mongoose.model("user",userSchema);

module.exports = user ;
