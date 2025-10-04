const express = require("express")
const USER = require("../models/userSchema")
const bcrypt = require("bcrypt")

const userRouter = express.Router()

userRouter.post("/user/signUp", async (req, res)=>{
  const {fullName, emailId, password, contact} = req.body
  const passwordHass = await bcrypt.hash(password, 10)
  const result = await USER.create({
    fullName,
    emailId,
    password: passwordHass,
    contact,
  });

  const token = await result.getJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    maxAge: 8 * 3600000, 
  });
  res.json(result)
})

userRouter.post("/user/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find user
    const result = await USER.findOne({ emailId });
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = await result.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = await result.getJWT();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 8 * 3600000, 
    });

    
    res.json({
      success: true,
      message: "Login successful",
      user: {
        // id: result._id,
        fullName: result.fullName,
        emailId: result.emailId,
        contact: result.contact,
      },
      // token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = userRouter