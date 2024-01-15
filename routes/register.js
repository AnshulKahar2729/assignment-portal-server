const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  try {
    // console.log(req.body);
    if (req.body.role === "student") {
      const { name, email, password, branch, year, division } = req.body;

      console.log(name, email, password, branch, year, division);

      //   console.log(name, email, password, branch, year, division )
      const hashedPassword = await bcrypt.hash(password, 10);

      // use crypto to createStudentId using name, branch, division of length 10
      const studentId = crypto
        .createHash("sha256")
        .update(`${name}${branch}${division}`)
        .digest("hex")
        .substring(0, 10);

      const studentDoc = new Student({
        name,
        email,
        password: hashedPassword,
        branch,
        year,
        division,
        studentId,
      });
      await studentDoc.save();

      console.log(studentDoc);

      const token = jwt.sign(
        { studentId, id:studentDoc._id, name:studentDoc.name, email: studentDoc.email, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log(token);
      res.status(201).json({ token });
    } else if (req.body.role === "teacher") {
      const { name, email, password } = req.body;

      // Add logic for teacher registration (if needed)
      const hashedPassword = await bcrypt.hash(password, 10);

      const teacherId = crypto
        .createHash("sha256")
        .update(`${name}${"teacher"}`)
        .digest("hex")
        .substring(0, 10);

      const teacherDoc = new Teacher({
        name,
        email,
        password: hashedPassword,
        teacherId
      });

      await teacherDoc.save();

      const token = jwt.sign(
        { teacherId, id: teacherDoc._id, name: teacherDoc.name, email: teacherDoc.email, role: "teacher" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({ token });
    } else {
      res.status(400).json({ error: "Invalid role" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
