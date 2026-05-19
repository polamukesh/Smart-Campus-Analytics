const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// Add Student
router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;