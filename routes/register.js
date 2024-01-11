const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

router.post("/", async (req, res) => {
  try {
    // console.log(req.body);
    if (req.body.role === "student") {
      const { name, email, password, branch, year, division } = req.body;

    //   console.log(name, email, password, branch, year, division )
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = new Student({
        name,
        email,
        password : hashedPassword,
        branch,
        year,
        division,
      });

      res.status(201).json(newStudent);
      const token = jwt.sign(
        { studentID: newStudent._id, email: newStudent.email, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      await newStudent.save();

      res.status(201).json({ token });
    } else if (req.body.role === "teacher") {
      const { name, email, password } = req.body;

      // Add logic for teacher registration (if needed)
      const hashedPassword = await bcrypt.hash(password, 10);

      const newTeacher = new Teacher({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { teacherID: newTeacher._id, email: newTeacher.email, role: "teacher" },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      await newTeacher.save();

      res.status(201).json({ token });
    } else {
      res.status(400).json({ error: "Invalid role" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;