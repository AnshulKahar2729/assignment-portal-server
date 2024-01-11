const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

router.post("/", async(req, res) => {
    const { email, password, role } = req.body;

    try {
      let user;
  
      if (role === "student") {
        user = await Student.findOne({ email });
      } else if (role === "teacher") {
        user = await Teacher.findOne({ email });
      }
  
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { userID: user._id, email: user.email, role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.status(200).json({ token });
    //   res.send(Received message: Success);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;