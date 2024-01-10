const express = require("express");
const router = express.Router();

// POST - /api/assignments/?role=teacher --> for uploading assignment
router.post("/", (req, res) => {
  if (req.query.role !== "teacher") {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  try {
    
    // Create assignment in the database as a teacher

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create assignment as a teacher" });
  }
});

// GET - /api/assignments/?role=teacher --> for getting all assignment as a teacher
router.get("/", (req, res) => {
  if (req.query.role !== "teacher") {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  try{
     // Retrieve all assignments from the database as a teacher

  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Failed to get assignment as a teacher" });
  }
});

// STUDENTS
router.post("/:assignmentId", (req, res) => {
    if (req.query.role !== "student") {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try{
        // Submit assignment in the database as a student
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to submit assignment as a student" });
    }
});

router.get("/:assignmentId", (req, res) => {
    if (req.query.role !== "student") {
        return res.status(403).json({ error: "Unauthorized access" });
    }
    try{
        // Retrieve a assignment from the database as a student
    } catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to get a assignment as a student" });
    }
})

router.get("/", (req, res) => {
    if (req.query.role !== "student") {
        return res.status(403).json({ error: "Unauthorized access" });
    }
    try{
        // Retrieve all submittedAssignments from the database as a student
    
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to get all assignment as a student" });
    }
})

module.exports = router;
