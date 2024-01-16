const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// @route   GET api/profile with headers token
router.post("/", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authorizationHeader.split(" ")[1];

    const payLoad = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!payLoad) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (payLoad.role === "student") {
      const student = await Student.findById(payLoad.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // delete student.password;
      const { password, ...studentWithoutPassword } = student;
      return res.status(200).json(studentWithoutPassword);
    } else if (payLoad.role === "teacher") {
      const teacher = await Teacher.findById(payLoad.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      // delete teacher.password;
      const { password, ...teacherWithoutPassword } = teacher;
      return res.status(200).json(teacherWithoutPassword);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error);
  }
});

module.exports = router;
