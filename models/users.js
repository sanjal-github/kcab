const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    _id:
    {
        type: String,
        //unique:true,
        required: true
    },
    name:
      {
        type:String
        
      }
        ,
    email:
    {
        type: String,
        unique:true

    },
    phone:
    {
        type: String,
        required: true,
    },
    status:
    {
        type: String,
        default: "New"
    }

},
    {
        timestamps: true
    }
)

const user = new mongoose.model("users", userSchema);

module.exports = user;
