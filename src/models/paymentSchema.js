const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", 
      required: true,
    },
    orderId:{
      type: String
    },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      
    },
    transactionId: { type: String, unique: true, sparse: true },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      fullName: {
        type: String,
      },
      stayName: {
        type: String,
      }
    },
  },
  { timestamps: true }
);



const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
