// app.js

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const validateToken = require("./middleware/validateTokenHandler");


const bodyParser = require('body-parser');
const User = require('./models/userModel'); // Adjust the path as necessary
const app = express();
// Connect Database
connectDB();

// Use body-parser middleware to parse JSON requests//new
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//old
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello world!"));

app.use("/api/users", require("./routes/userRoute"));
// Error handling middleware//new
app.use((err, req, res, next) => {
    res.status(err.status || 500);
  });

app.use("/api/location", require("./routes/locationRoute")); // Add this line
app.use("/api/upload", require("./routes/multerRoute")); // Mount MulterRoute to handle file uploads
app.use("/api/users",require("./routes/bankRoute"),validateToken);

const port = 9090;

app.listen(9090, () => console.log(`Server running on port ${port}`));
