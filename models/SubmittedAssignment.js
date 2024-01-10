const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const submittedAssignmentSchema = new Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
  late: {
    type: Boolean,
    default: false,
    required : true
  },
  file: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
});

const SubmittedAssignment = model(
  "SubmittedAssignment",
  submittedAssignmentSchema
);

module.exports = SubmittedAssignment;
