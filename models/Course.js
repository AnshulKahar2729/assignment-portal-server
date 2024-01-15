const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  assignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teacher",
  },
});

const Course = model("Course", courseSchema);
module.exports = Course;
