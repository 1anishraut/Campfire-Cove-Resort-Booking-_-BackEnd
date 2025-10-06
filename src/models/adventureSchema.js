const mongoose = require("mongoose");

const adventureSchema = new mongoose.Schema({
  advName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  advImage: {
    type: String,
    
  },
  advDescription: {
    type: String,
    required: true,
  },
  advPrice: {
    type: Number,
    required: true,
  },
});

const Adventure_Data = mongoose.model("Adventure_Data", adventureSchema);

module.exports = Adventure_Data;
