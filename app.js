// app.js

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const validateToken = require("./middleware/validateTokenHandler");
const rbacMiddleware = require("./middleware/rbacMiddleware");

const app = express();

// Connect Database
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello world!"));//AA

app.use("/api/users", require("./routes/userRoute")); //HH

app.use("/api/vehicle", require("./routes/vehicleRoute"));//MMM

app.use("/api/location", require("./routes/locationRoute")); // EEE
app.use("/api/upload", require("./routes/multerRoute")); // DDD

app.use("/api/users/bank",require("./routes/bankRoute"),validateToken); //HHH

app.use("/api/subscription", require("./routes/subscriptionRoute"));//AAA
app.use("/api/records", require("./routes/records"));//MMM

app.use('/api/search',require("./routes/searchRoute"));//DDD
app.use('/api/wallet',require("./routes/walletRoute"));//YYY

const port = 9090;

app.listen(9090, () => console.log(`Server running on port ${port}`));
