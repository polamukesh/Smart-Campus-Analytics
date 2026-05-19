const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/students", studentRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("SmartCampus Backend Running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});