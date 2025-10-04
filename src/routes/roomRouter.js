const express = require("express");
const Room_Data = require("../models/roomSchema");
const { adminAuth } = require("../middleware/Auth");

const addRoomRouter = express.Router();

addRoomRouter.post("/admin/addStays", adminAuth, async (req, res) => {
  try {
    const {
      roomName,
      roomPrice,
      roomImage,
      roomSize,
      roomDescription,
      roomStatus,
      roomCheckIn,
      roomCheckOut,
    } = req.body;

    const newRoom = await Room_Data.create({
      roomName,
      roomPrice,
      roomImage,
      roomSize,
      roomDescription,
      roomStatus,
      roomCheckIn,
      roomCheckOut,
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error adding new stay:", error);
    res.status(500).json({ error: "Failed to add new stay" });
  }
});


addRoomRouter.patch("/admin/editStay/:roomId", adminAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    // console.log(roomId);

    const { roomName, roomSize, roomPrice } = req.body;

    // if (!roomName) {
    //   return res.status(400).json({ error: "roomName is required" });
    // }
    const editRoom = await Room_Data.findByIdAndUpdate(
      roomId,
      { roomSize: roomSize, roomPrice: roomPrice },
      { new: true }
    );
    if (!editRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(editRoom);
  } catch (error) {
    res.status(500).json({ erroR: error.message });
  }
});
addRoomRouter.delete("/admin/deleteStay/:roomId", adminAuth, async (req, res)=>{
  const {roomId} = req.params;
  const deleteRoom = await Room_Data.findByIdAndDelete(roomId)
  res.json(deleteRoom)
})

addRoomRouter.get("/admin/listStays",  async (req, res) => {
  try {
    const roomList = await Room_Data.find({});

    if (!roomList || roomList.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found. Please add new Stay." });
    }

    res.json(roomList);
  } catch (error) {
    console.error("Error fetching Stays:", error.message);
    res.status(500).json({ message: "Server error while fetching room data." });
  }
});


module.exports = addRoomRouter;
