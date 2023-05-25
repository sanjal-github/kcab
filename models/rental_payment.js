const mongoose = require("mongoose");

const rentalPaymentSchema = new mongoose.Schema({
  _id:
  {
    type:String,
  },
  transaction_id:
  {
    type:Number,
    default:0
  },
  complete_id:
  {
    type:String,
  },
  total_payment:
  {
    type:Number,
    default:0
  },
  tax:
  {
    type:Number,
    default:0,
  },
  net_Payment:
  {
    type:Number,
    default:10
  },
  status:
  {
    type:String,
    enum:["paid","unpaid","partial"],
    default:"unpaid"
  }
},
{
  timestamps:true
})

const rental_cab_paymnt = new mongoose.model("rentCabPays",rentalPaymentSchema);
module.exports = rental_cab_paymnt;
