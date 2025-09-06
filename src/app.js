require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/connectDB");
const adminRouter = require("./routes/adminRouter");
const addRoomRouter = require("./routes/roomRouter");
const cookieParser = require("cookie-parser");
const menuRouter = require("./routes/menuRouter");

const app = express();
const server = http.createServer(app);


const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // allow frontend

app.use(express.json());
app.use(cookieParser());

app.use("/", adminRouter);
app.use("/", addRoomRouter);
app.use("/", menuRouter);

connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(process.env.PORT, () => {
      console.log(
        `Server is running on : http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Getting errer in connecting database mongoDB");
  });
