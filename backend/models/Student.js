const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  department: String,
  attendance: Number,
});

module.exports = mongoose.model("Student", StudentSchema);