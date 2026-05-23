const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const studentRoutes =
  require("./routes/studentRoutes");

const authRoutes =
  require("./routes/authRoutes");

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Routes
app.use("/students", studentRoutes);

app.use("/auth", authRoutes);


// Home Route
app.get("/", (req, res) => {
  res.send(
    "Smart Campus Backend Running"
  );
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    console.log("MongoDB Connected")
  )
  .catch((err) =>
    console.log(err)
  );


// Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});