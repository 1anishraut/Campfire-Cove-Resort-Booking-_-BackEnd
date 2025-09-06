const express = require("express");
const Menu_Data = require("../models/menuSchema");

const menuRouter = express.Router()

menuRouter.post("/admin/addMenu", async (req, res) => {
  try {
    const { mealType, category, price } = req.body;
    let updateQuery = {};

    if (mealType === "breakfast") {
      updateQuery = { "breakfast.price": price };
    } else if (mealType === "lunch") {
      if (category === "veg") updateQuery = { "lunch.veg": price };
      if (category === "nonveg") updateQuery = { "lunch.nonVeg": price };
    } else if (mealType === "dinner") {
      if (category === "veg") updateQuery = { "dinner.veg": price };
      if (category === "nonveg") updateQuery = { "dinner.nonVeg": price };
    }

    // update existing doc or create one if none
    const updatedMenu = await Menu_Data.findOneAndUpdate(
      {},
      { $set: updateQuery },
      { new: true, upsert: true }
    );

    res.json(updatedMenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
menuRouter.get("/admin/viewMenu", async (req, res)=>{
  const menuData = await Menu_Data.find({});
  res.json(menuData)
})


module.exports = menuRouter