const express = require("express");
const ADMIN = require("../models/adminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminRouter = express.Router();

adminRouter.post("/admin/signUp", async (req, res) => {
  try {
    const { managerName, managerId, password } = req.body;
    const passwordHass = await bcrypt.hash(password, 10);

    const result = await ADMIN.create({
      managerName,
      managerId,
      password: passwordHass,
    });
    // Create JWT Token for auto login after signup
    const token = await result.getJWT();

    // Add token to cookie and send back to user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

adminRouter.post("/admin/login", async (req, res) => {
  try {
    const { managerId, password } = req.body;
    const result = await ADMIN.findOne({ managerId });
    if (!result)
      return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await result.validatePassword(password);

    if (isPasswordValid) {
      // Create JWT Token
      const token = await result.getJWT();

      // Add token to cookie and send back to user
      res.cookie(
        "token",
        token,
        {
          httpOnly: true,
          secure: false, // ⚠️ set to true when using HTTPS in production
          sameSite: "lax",
          maxAge: 8 * 3600000,
        },
        {
          expires: new Date(Date.now() + 8 * 3600000),
        }
      );
      res.json(result);
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

adminRouter.post("/admin/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout Successful");
  } catch (error) {
    res.status(400).send("ERROR in logout: " + error.message);
  }
});

module.exports = adminRouter;
