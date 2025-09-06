const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const adminSchema = mongoose.Schema({
  managerName: {
    type: String,
    required: true
  },
  managerId:{
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    
    required: true
  }
})


adminSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

adminSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const ADMIN = mongoose.model("ADMIN", adminSchema)

module.exports = ADMIN