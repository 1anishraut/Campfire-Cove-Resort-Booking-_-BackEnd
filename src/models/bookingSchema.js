const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    contact: { type: String, required: true, match: /^[0-9]{10}$/ },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room_Data",
      // required: true,
    },
    adventureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adventure_Data",
      // required: true,
    },
    checkIn: {
      type: Date,
      //  required: true
    },
    checkOut: {
      type: Date,
      // required: true,
      validate: {
        validator: function (value) {
          return value > this.checkIn;
        },
        message: "Check-out must be after check-in",
      },
    },
    guests: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "cancelled"],
      default: "pending_payment",
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);



const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
