const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Student } = require("../models/Student");

router.post("/", async(req, res) => {
    if(req.body.role === "student"){
        const { name, email, password, branch, year, division } = req.body;

        const hasedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hasedPassword,
            branch,
            year,
            division,
        });

        const token = jwt.sign(
            { studentID: student._id, email: student.email, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(201).json({ token });
    } else if(req.body.role === "teacher"){
        const { name, email, password } = req.body;
    }
})

module.exports = router;