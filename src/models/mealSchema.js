const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    mealCategory: {
      type: String,
    },
    mealName: {
      type: String,
    },
    mealType: {
      type: String,
      default: "Veg",
      enum: {
        values: ["Veg", "Non Veg"],
        message: `{VALUE} is not a valid meal type`,
      },
    },
    mealPrice: {
      type: Number,
      min: 0,
    },
    mealImage: {
      type: String,
    },
    cuisine: {
      type: String,
      enum: ["Indian", "Chinese"],
      message: `{VALUE} is not a valid cuisine type`,
    },
  },
  { timestamps: true }
);

const Meals_Data = mongoose.model("Meal_Data", mealSchema);

module.exports = Meals_Data;
