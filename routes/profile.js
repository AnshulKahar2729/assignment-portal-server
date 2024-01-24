const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// @route   GET api/profile with headers token
router.get("/", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("header ", authHeader, "/n");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    console.log(token, "token");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(process.env.JWT_SECRET);
    const payLoad = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });
    console.log("payload", payLoad);
    if (!payLoad) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (payLoad.role === "student") {
      const student = await Student.findById(payLoad.id).populate({
        path: "enrolledCourses",
        model: "Course",
        populate: {
          path: "teacher",
          model: "Teacher",
        },
        populate: {
          path: "assignments",
          model: "Assignment",
        },
        populate: {
          path: "teacher",
          model: "Teacher",
        },
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Remove password from student object using destructuring
      const { password, ...studentWithoutPassword } = student._doc;

      console.log(studentWithoutPassword);
      return res.status(200).json(studentWithoutPassword);
    } else if (payLoad.role === "teacher") {
      const teacher = await Teacher.findById(payLoad.id).populate({
        path: "assignedCourses",
        model: "Course",
        populate: {
          path: "studentsEnrolled",
          model: "Student",
        },
      });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      const { password, ...teacherWithoutPassword } = teacher._doc;

      console.log(teacherWithoutPassword);
      return res.status(200).json(teacherWithoutPassword);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
