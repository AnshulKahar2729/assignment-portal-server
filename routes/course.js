const express = require("express");
const Course = require("../models/Course");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

// GET with ID --> need to delete later
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET all course general
router.get("/", async (req, res) => {
  try {
    if (req.query.role === "teacher") {
      const { teacherId } = req.body;
      const teacherDoc = await Teacher.findOne({ teacherId });
      console.log(teacherDoc);
      if (!teacherDoc) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      console.log(teacherDoc);
      const courses = await Course.find({ teacher: teacherDoc._id });

      res.status(200).json(courses);
    } else if (req.query.role === "student") {
      const { studentId } = req.body;

      // need to find the courses in which the student is enrolled
      const studentDoc = await Student.findOne({ studentId });

      if (!studentDoc) {
        return res.status(404).json({ error: "Student not found" });
      }

      const enrolledCoursesDoc = await Course.find({ studentsEnrolled: studentDoc._id });   // array of courses in which the student is enrolled
      if(enrolledCoursesDoc){
        const sendCourses = [];
        const courses = await Course.find();   // array of all courses

        courses.map((course, index) => {
            enrolledCoursesDoc.map((enrolledCourse, index) => {
                if(enrolledCourse._id === course.id){
                    sendCourses.push(course);
                } else {
                    sendCourses.push({name : course.name, teacher : course.teacher, numberOfStudents : course.studentsEnrolled.length});
                }
            })
        })
        res.status(200).json({sendCourses});
      } else {
        const courses = await Course.find();
        res.status(200).json({name : courses.name, teacher : courses.teacher, numberOfStudents : courses.studentsEnrolled.length});
      }
      
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST --> as a teacher
router.post("/", async (req, res) => {
  if (req.query.role !== "teacher") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const { name, teacherId } = req.body;
    console.log(name, teacherId);

    const teacherDoc = await Teacher.findOne({ teacherId });
    console.log(teacherDoc);
    if (!teacherDoc) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    console.log(teacherDoc);

    const courseDoc = new Course({
      name,
      teacher: teacherDoc._id,
    });
    console.log(courseDoc);

    await courseDoc.save();
    console.log(courseDoc);

    res.json({ courseDoc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// API for enrolling a course a student
router.post("/enroll/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    console.log(courseId, studentId);

    // check if the course exists
    const courseDoc = await Course.findById(courseId);
    console.log(courseDoc);


    if (!courseDoc) {
      return res.status(404).json({ error: "Course not found" });
    }

    // found the student with courseId
    const studentDoc = await Student.findOne({ studentId });
    console.log(studentDoc);
    if (!studentDoc) {
      return res.status(404).json({ error: "Student not found" });
    }

    // check if the student is already enrolled in the course
    const isEnrolled = await Course.findOne({ studentsEnrolled: studentDoc._id });
    if(isEnrolled){
      return res.status(403).json({ error: "Student already enrolled" });
    }
    const updatedCourseDoc = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: studentDoc._id } },
      { new: true }
    );
    console.log(updatedCourseDoc);

    const updatedStudentDoc = await Student.findByIdAndUpdate(
      studentDoc._id,
      { $push: { enrolledCourses: courseDoc._id } },
      { new: true }
    );

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
