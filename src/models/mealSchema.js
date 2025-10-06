const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    mealCategory: {
      type: String,
      required: true,
    },
    mealName: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      default: "Veg",
      required: true,
      enum: {
        values: ["Veg", "Non Veg"],
        message: `{VALUE} is not a valid meal type`,
      },
    },
    mealPrice: {
      type: Number,

      required: true,
    },
    mealImage: {
      type: String,
    },
    cuisine: {
      type: String,
      required: true,
      enum: ["Indian", "Chinese"],
      message: `{VALUE} is not a valid cuisine type`,
    },
  },
  { timestamps: true }
);

const Meals_Data = mongoose.model("Meal_Data", mealSchema);

module.exports = Meals_Data;
