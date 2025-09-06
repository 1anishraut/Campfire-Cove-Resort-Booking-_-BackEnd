const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    breakfast: {
      price: {
        type: Number,
        default: 100, // fixed price
      },
    },
    lunch: {
      veg: {
        type: Number,
        default: 200,
      },
      nonVeg: {
        type: Number,
        default: 300,
      },
    },
    dinner: {
      veg: {
        type: Number,
        default: 200,
      },
      nonVeg: {
        type: Number,
        default: 300,
      },
    },
  },
  { timestamps: true }
);

const Menu_Data = mongoose.model("Menu_Data", menuSchema);

module.exports = Menu_Data;
