const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const assignmentSchema = new Schema({
  startDate: {
    type: Date,
    // required: true,
  },
  endDate: {
    type: Date,
    // required: true,
  },
  file: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubmittedAssignment",
    },
  ],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

const Assignment = model("Assignment", assignmentSchema);
module.exports = Assignment;
