const mongoose = require("mongoose");


const connectDB = async () => {
  
    // console.log(" Mongo URL:", process.env.DB_CONNECTION);
    await mongoose.connect(process.env.DB_CONNECTION);
  
};

module.exports = connectDB;
