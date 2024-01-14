const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const uploadOnCloudinary = require("../utils/uploadOnCloudinary");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Teacher = require("../models/Teacher");
const SubmittedAssignment = require("../models/SubmittedAssignment");

// POST - /api/assignment/?role=teacher --> for uploading assignment
router.post("/", (req, res) => {
  if (req.query.role !== "teacher") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    // Call multer manually to handle file upload
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ err });
      }

      const {title} = req.body;

      const URL = await uploadOnCloudinary(req.file.path);

      const assignmentDoc = await Assignment.create({
        file: URL,
        title: title,
      });

      console.log("assign", assignmentDoc);
      const courseDoc = await Course.updateOne(
        {
          _id: "65a049c12de4d08cd7848bcb",
        },
        { $push: { assignments: assignmentDoc._id } }
      );

      console.log("course", courseDoc);
      res.json({ URL: assignmentDoc.file });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create assignment as a teacher" });
  }
});

// GET - /api/assignments/for getting all assignment as a teacher and student both
router.get("/", async (req, res) => {
  try {
    // Retrieve all assignments from the database as a teacher
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get assignment" });
  }
});

// GET - /api/assignments/:assignmentId/ --> for getting a assignment as a teacher and student both
router.get("/:assignmentId", async (req, res) => {
  if (req.query.role !== "teacher") {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  const { assignmentId } = req.params;
  try {
    // Retrieve a assignment from the database as a teacher
    const assignment = await Assignment.findById(assignmentId);
        
    if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get assignment by provided ID" });
  }
});

// STUDENTS
// To submit an assignment as a student 
router.post("/submitassignment/:assignmentId", (req, res) => {
  if (req.query.role !== "student") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const { assignmentId } = req.params;
    const { studentId } = req.body;
    console.log("uploadedAssignment", assignmentId);
    // Submit assignment in the database as a student

    // Call multer manually to handle file upload
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to handle file upload" });
      }

      const URL = await uploadOnCloudinary(req.file.path);

      // shyd submittedAssignment mein isse assignment hata dena chahiye
      const submittedAssignmentDoc = await SubmittedAssignment.create({
        submittedBy: studentId,
        file: URL,
        title: "FIRST SUBMITTED ASSIGNMENT",
        submissionDate: new Date(),
        assignment: assignmentId,
      });

      console.log("submittedAssignment", submittedAssignmentDoc);

      const assignmentDoc = await Assignment.updateOne(
        {
          _id: assignmentId,
        },
        { $push: { submissions: submittedAssignmentDoc._id } }
      );

      console.log("assignment", assignmentDoc);

      res.json({ URL: submittedAssignmentDoc.file });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to submit assignment as a student" });
  }
});


// To get all submitted assignment as a student
router.get("/submittedassignment",async (req, res) => {
 /*  if (req.query.role !== "student") {
    return res.status(403).json({ error: "Unauthorized access" });
  } */
  try {
    // Retrieve all submittedAssignments from the database as a student
    const submittedAssignments = await SubmittedAssignment.find();
    res.json(submittedAssignments);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to get all assignment as a student" });
  }
});

module.exports = router;
