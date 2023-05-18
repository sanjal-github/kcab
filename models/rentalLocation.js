const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    _id:
    {
        type:String
    },
    rental_id:
    {
        type:String,
        required:true
    },
    location:
    {
        type:
          {type:String,
          required:true
          },
          coordinates:[]
    }

},
{
    timestamps:true
});

const myLocation = new mongoose.model("rentallocation",locationSchema);
module.exports = myLocation;
