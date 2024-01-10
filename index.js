const express = require('express');
require("dotenv").config();
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');

// models
const { upload } = require('./utils/multer');
const { Student } = require('./models/Student');

// routes
const assignmentRouter = require('./routes/assignment');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const PORT = process.env.PORT ||4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("DB connected");
}).catch((err) => {
    console.log(err);
});

app.use("/api/assignment", assignmentRouter);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);

app.get('/api/test', (req, res) => {
    res.send('Hello World!');

    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
