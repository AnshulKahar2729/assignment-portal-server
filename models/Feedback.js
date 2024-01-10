const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const feedbackSchema = new Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Teacher",
        required : true
    },
    grades :{
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
});

const Feedback = model("Feedback", feedbackSchema);
module.exports = Feedback;