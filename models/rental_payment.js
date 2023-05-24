const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  _id:
  {
    type:String,
  },
  verify_id:
  {
    type:String,
  },
  transaction_id:
  {
    type:String,
  },
  date:
  {
    type:Date
  },
  time:
  {
    type:Date
  },
  total_time:
  {
    type:Number
  },
  tax:
  {
    type:Number
  },
  total_Amount:
  {
    type:Number,
  },
  pay_mode:
  {
    type:String,
    enum:["cash","online"]
  },
  status:
  {
    type:String
  }

})