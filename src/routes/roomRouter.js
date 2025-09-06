const express = require("express");
const Room_Data = require("../models/roomSchema");
const { adminAuth } = require("../middleware/Auth");

const addRoomRouter = express.Router();

addRoomRouter.post("/admin/addRoom", adminAuth, async (req, res) => {
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
  res.json(newRoom);
});

addRoomRouter.patch("/admin/editRoom/:roomId", adminAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log(roomId);

    const { roomName, roomSize, roomPrice } = req.body;

    if (!roomName) {
      return res.status(400).json({ error: "roomName is required" });
    }
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

addRoomRouter.get("/admin/listRooms", async (req, res) => {
  const roomList = await Room_Data.find({});
  res.json(roomList);
});

module.exports = addRoomRouter;
