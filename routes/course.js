const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// GET with ID
router.get('/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        
        if (!course) {
        return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET all course general
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST
router.post("/", async (req, res) =>{
    if(req.body.role !== "teacher"){
        return res.status(403).json({error: "Unauthorized access"});
    }

    try{

        const teacherId = "akkjs"
        const {name} = req.body;

        const newCourse = new Course({
            name,
        });

        await newCourse.save();


        res.json({newCourse});
        
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to create course as a teacher"});
    }
})


module.exports = router;