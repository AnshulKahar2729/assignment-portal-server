const express = require("express");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { coursesIdArr } = req.body;
    const teacherArr = []; /*  {email, name, courseName} */

    console.log(coursesIdArr)
    // with forloop
    for (let i = 0; i < coursesIdArr.length; i++) {
      const courseId = coursesIdArr[i];
      const courseDoc = await Course.findById(courseId);
      const { name: courseName } = courseDoc;

      const teacherDoc = await Teacher.findById(courseDoc.teacher);
      const { email, name } = teacherDoc;
      const teacherObj = { email, name, courseName };
      // Create a unique object for each teacher with their respective courses
      let flag = 0;
      for (let j = 0; j < teacherArr?.length; j++) {
        if (teacherArr[j]?.email === email) {
          flag = 1;
          teacherArr[j].courseName += `, ${courseName}`;
          break;
        }
      }

      if (flag === 0) {
         teacherArr?.push(teacherObj);
      }
    }

    res.status(200).json(teacherArr);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;