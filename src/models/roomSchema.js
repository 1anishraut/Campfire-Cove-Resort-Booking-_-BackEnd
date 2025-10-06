const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    roomPrice: {
      type: Number,
      required: true,
    },
    roomImage: {
      type: String,
    },
    roomSize: {
      type: String,
    },
    roomDescription: {
      type: String,
    },
    roomStatus: {
      type: String,
      default: "Available",
      required: true,
      enum: {
        values: ["Booked", "Available"],
        message: `{VALUE} is not a valid Stay Status type`,
      },
    },
    roomCheckIn: {
      type: Date,
      // required: true,
    },
    roomCheckOut: {
      type: Date,
      // required: true,
      validate: {
        validator: function (value) {
          if (!this.roomCheckIn) return true; // skip if no check-in
          const diffInMs = value - this.roomCheckIn;
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          return diffInDays >= 1 && diffInDays <= 4;
          // ✅ at least 1 day, max 4 days
        },
        message: "Stay must be between 1 and 4 days",
      },
    },
  },
  { timestamps: true }
);

const Room_Data = mongoose.model("Room_Data", roomSchema);

module.exports = Room_Data;
