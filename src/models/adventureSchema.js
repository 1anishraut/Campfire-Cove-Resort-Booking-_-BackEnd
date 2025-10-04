const mongoose = require("mongoose")

const adventureSchema = new mongoose.Schema({
  advName:{
    type: String
  },
  advImage:{
    type: String
  },
  advDescription: {
    type: String
  },
  advPrice: {
    type: Number
  }

})

const Adventure_Data = mongoose.model("Adventure_Data", adventureSchema)

module.exports = Adventure_Data