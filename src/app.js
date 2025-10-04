require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/connectDB");
const adminRouter = require("./routes/adminRouter");
const addRoomRouter = require("./routes/roomRouter");
const cookieParser = require("cookie-parser");
const menuRouter = require("./routes/menuRouter");
const userRouter = require("./routes/userRouter")
const bookingRouter = require ("./routes/bookingRouter")

const app = express();
const server = http.createServer(app);

const cors = require("cors");
const adventureRouter = require("./routes/adventureRouter");
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://campfire-cove-resort-booking-front-tau.vercel.app", 
    ],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/", adminRouter);
app.use("/", addRoomRouter);
app.use("/", menuRouter);
app.use("/", adventureRouter);
app.use("/", userRouter);
app.use("/", bookingRouter);



// connectDB()
//   .then(() => {
//     console.log("✅ MongoDB connected");

//     server.listen(process.env.PORT, () => {
//       console.log(
//         `Server is running on : http://localhost:${process.env.PORT}`
//       );
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Getting errer in connecting database mongoDB");
//   });

//  Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));


//  Export app for Vercel (no app.listen)
module.exports = app;