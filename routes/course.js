const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

router.post("/", (req, res) =>{
    if(req.body.role !== "teacher"){
        return res.status(403).json({error: "Unauthorized access"});
    }

    try{
        const {name} = req.body;

        const course = new Course({
            name,
        });

        res.json({course});
        
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to create course as a teacher"});
    }
})


module.exports = router;