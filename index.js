const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

// models
const { upload } = require("./utils/multer");
const { Student } = require("./models/Student");

// routes
const assignmentRouter = require("./routes/assignment");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const profileRouter = require("./routes/profile");
const courseRouter = require("./routes/course");
const teacherRouter = require("./routes/teacher");

const PORT = process.env.PORT || 4000;

// Middleware
// Middleware
const corsOptions = {
  origin: "*", // replace with your frontend URL
  credentials: true, // include credentials like cookies in the request
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // specify the allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // specify the allowed headers
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/assignment", assignmentRouter);
app.use("/api/course", courseRouter);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/profile", profileRouter);
app.use("/api/teacher", teacherRouter);

app.get("/api/test", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
