const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/bookingSchema");
const Room = require("../models/roomSchema"); // your Room_Data model
const Adventure_Data = require("../models/adventureSchema");
const { adminAuth } = require("../middleware/Auth");


const Payment = require("../models/paymentSchema");
const Room_Data = require("../models/roomSchema");

const bookingRouter = express.Router();

// ✅ Step 1 & 2: Create Booking
bookingRouter.post("/booking/create", async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      contact,
      roomId,
      checkIn,
      checkOut,
      guests,
      adventureId,
    } = req.body;

    const room = await Room.findById(roomId);
    // if (!room) return res.status(404).json({ message: "Room not found" });

    const days = Number(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    

      let adventure = await Adventure_Data.findById(adventureId)
    
    
    let amount = (room?.roomPrice || 0) * days;
    amount = amount + (adventure?.advPrice || 0)
    amount = amount * 1.18
    
    const booking = await Booking.create({
      fullName,
      emailId,
      contact,
      roomId,
      adventureId,
      checkIn,
      checkOut,
      guests,
      amount,
    });
    
    
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

//  Step 3: Get Booking Details
bookingRouter.get("/booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("roomId").populate("adventureId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({
      booking,
      RAZORPAY_KEY_ID: "rzp_test_RL3tCu2KFn4vyE"
    });
  } catch (err) {
    res.status(500).json({ message: "Error : No bookings found" });
  }
});

//  Step 4: Create Razorpay Order
bookingRouter.post("/booking/pay/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("roomId")
      .populate("adventureId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: booking.amount * 100, 
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    console.log(order);
    const paymentData = await Payment.create({
      bookingId: req.params.id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    res.json({
      paymentData, booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment error" });
  }
});

//  Razorpay Webhook to confirm payment
bookingRouter.post("/booking/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      const booked = await Booking.findByIdAndUpdate(
        bookingId,
        {
          status: "confirmed",
          paymentId: razorpay_payment_id,
        },
        { new: true }
      );

      if (!booked) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }

      // 2️⃣ update the room
      await Room_Data.findByIdAndUpdate(booked.roomId, {
        roomStatus: "Booked",
      });
      

      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all BOokings 
bookingRouter.get("/admin/allBookings", adminAuth, async (req, res) => {
  try {
    const allBookings = await Booking.find({})
      .populate("roomId")
      .populate("adventureId");
    res.json(allBookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
});

//  Delete a booking
bookingRouter.delete(
  "/admin/bookingDelete/:id",
  adminAuth,
  async (req, res) => {
    try {
      const bookingId = req.params.id; 
      const deleted = await Booking.findByIdAndDelete(bookingId);
      if (!deleted) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Booking Deleted" });
    } catch (err) {
      console.error("Error deleting booking:", err);
      res.status(500).json({ message: "Failed to delete booking" });
    }
  }
);

module.exports = bookingRouter;
