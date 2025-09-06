const jwt = require("jsonwebtoken");
const ADMIN = require("../models/adminSchema");

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token, please log in" });
    }

    // Verify token
    let decodedObj;
    try {
      decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const adminData = await ADMIN.findById(decodedObj._id);
    if (!adminData) {
      return res.status(404).json({ message: "ADMIN not found" });
    }

    req.adminData = adminData; // attach ADMIN to request
    next();
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

module.exports = { adminAuth };
