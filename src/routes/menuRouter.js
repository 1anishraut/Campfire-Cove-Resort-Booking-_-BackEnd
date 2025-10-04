const express = require("express");
const Meals_Data = require("../models/mealSchema");
const { adminAuth } = require("../middleware/Auth");

const menuRouter = express.Router();

menuRouter.post("/admin/addMeals", adminAuth, async (req, res) => {
  try {
    const { mealCategory, mealName, mealType, mealPrice, mealImage, cuisine } =
      req.body;
    const result = await Meals_Data.create({
      mealCategory,
      mealType,
      mealName,
      mealPrice,
      mealImage,
      cuisine,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
menuRouter.patch("/admin/editMeal/:mealId", adminAuth, async (req, res) => {
  try {
    const { mealId } = req.params;
    const { mealCategory, mealType, mealName, mealPrice, mealImage, cuisine } =
      req.body;

    const result = await Meals_Data.findByIdAndUpdate(
      mealId,
      {
        mealCategory,
        mealType,
        mealName,
        mealPrice,
        mealImage,
        cuisine,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ error: "Failed to update meal" });
  }
});

menuRouter.get("/admin/listMeals", adminAuth, async (req, res) => {
  try {
    const menuData = await Meals_Data.find({});
    res.json(menuData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
menuRouter.delete("/admin/deleteMeal/:mealId", adminAuth, async (req, res)=>{
  const { mealId } = req.params;
  const result = await Meals_Data.findByIdAndDelete(mealId)
  res.json({message: "Deleted", result})
})

module.exports = menuRouter;
