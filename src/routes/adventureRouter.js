const express = require("express");
const { adminAuth } = require("../middleware/Auth");
const Adventure_Data = require("../models/adventureSchema");

const adventureRouter = express.Router();

// Add Adventure
adventureRouter.post("/admin/addAdventure", adminAuth, async (req, res) => {
  try {
    const { advName, advPrice, advDescription, advImage } = req.body;
    const result = await Adventure_Data.create({
      advDescription,
      advImage,
      advName,
      advPrice,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("Error adding adventure:", err);
    res.status(500).json({ error: "Failed to add adventure" });
  }
});

// List Adventures
adventureRouter.get("/admin/listAdventure", async (req, res) => {
  try {
    const result = await Adventure_Data.find({});
    if (result.length === 0) {
      return res.status(404).json({ message: "No adventure data found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching adventures:", err);
    res.status(500).json({ error: "Failed to fetch adventures" });
  }
});

// Edit Adventure
adventureRouter.patch(
  "/admin/editAdventure/:advId",
  adminAuth,
  async (req, res) => {
    try {
      const { advId } = req.params;
      const { advDescription, advImage, advName, advPrice } = req.body;

      const result = await Adventure_Data.findByIdAndUpdate(
        advId,
        { advDescription, advImage, advName, advPrice },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Adventure not found" });
      }

      res.json(result);
    } catch (err) {
      console.error("Error editing adventure:", err);
      res.status(500).json({ error: "Failed to edit adventure" });
    }
  }
);

// Delete Adventure
adventureRouter.delete(
  "/admin/deleteAdventure/:advId",
  adminAuth,
  async (req, res) => {
    try {
      const { advId } = req.params;
      const result = await Adventure_Data.findOneAndDelete({ _id: advId });

      if (!result) {
        return res.status(404).json({ message: "Adventure not found" });
      }

      res.json({ message: "Adventure deleted successfully", deleted: result });
    } catch (err) {
      console.error("Error deleting adventure:", err);
      res.status(500).json({ error: "Failed to delete adventure" });
    }
  }
);

module.exports = adventureRouter;
