const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  division: {
    type: String,
    required: true,
    trim: true,
  },
  submittedAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubmittedAssignment",
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const Student = model("Student", studentSchema);
module.exports = Student;
