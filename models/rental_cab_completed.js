const mongoose = require("mongoose");

const rentalCabCompSchema = new mongoose.Schema({
  _id:
  {
    type:String,
  },
  verify_id:
  {
    type:String,
  },
  completedAt:
  {
    type:Date
  },
  total_hour:
  {
    type:Number,
    default:0
  },
  total_payment:
  {
    type:Number,
    default:0
  }
},
{
  timestamps:true
})

const rental_cab_complete = new mongoose.model("rentCabComp",rentalCabCompSchema);
module.exports = rental_cab_complete;
