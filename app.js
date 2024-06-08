// app.js

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const validateToken = require("./middleware/validateTokenHandler");
const rbacMiddleware = require("./middleware/rbacMiddleware");
const userModel = require("./models/userModel");
const { default: mongoose } = require("mongoose");
const bankModel = require("./models/bankModel.js");
// const { default: AdminJS } = require("adminjs");

// const { AdminJS } = require("adminjs");
// const { AdminJSExpress } = require("@adminjs/express");

// import AdminJS from "adminjs";
// import AdminJSExpress from "@adminjs/express";
const app = express();

// Connect Database
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello world!")); //AA

app.use("/api/users", require("./routes/userRoute")); //HH

app.use("/api/vehicle", require("./routes/vehicleRoute")); //MMM

app.use("/api/location", require("./routes/locationRoute")); // EEE
app.use("/api/upload", require("./routes/multerRoute")); // DDD

app.use("/api/users/bank", require("./routes/bankRoute"), validateToken); //HHH

app.use("/api/subscription", require("./routes/subscriptionRoute")); //AAA
app.use("/api/records", require("./routes/records")); //MMM

app.use("/api/search", require("./routes/searchRoute")); //DDD
app.use("/api/wallet", require("./routes/walletRoute")); //YYY
app.use("/api/profile", require("./routes/profileRoutes"));

const port = 9090;

Promise.all([
  import("adminjs"),
  import("@adminjs/express"),
  import("@adminjs/mongoose"),
  import("mongoose"),
  import("express"),
  import("./models/userModel.js"), // Import the User model
  import("./models/vehicleModel.js"), // Import the Vehicle model
  import("./models/bankModel.js"), // Import the Vehicle model
  import("./models/walletModel.js"), // Import the Vehicle model
  import("./models/fileUploadModel.js"), // Import the Vehicle model
])
  .then(
    ([
      { default: AdminJS },
      { default: AdminJSExpress },
      AdminJSMongoose,
      { default: mongoose },
      { default: express },
      { default: User }, // Destructure the User model import
      { default: Vehicle }, // Destructure the Vehicle model import
      { default: Bank }, // Destructure the Vehicle model import
      { default: Wallet }, // Destructure the Vehicle model import
      { default: File }, // Destructure the Vehicle model import
    ]) => {
      const PORT = 9090;

      // Register the AdminJS Mongoose adapter
      AdminJS.registerAdapter({
        Resource: AdminJSMongoose.Resource,
        Database: AdminJSMongoose.Database,
      });

      const start = async () => {
        try {
          await mongoose.connect(
            "mongodb+srv://maielaser22:CarAidMai@cluster0.bfted2q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            { useNewUrlParser: true, useUnifiedTopology: true },
          );
          console.log("Connected to MongoDB");

          const adminOptions = {
            resources: [
              {
                resource: User,
                options: {
                  properties: {
                    vehicles: {
                      reference: "Vehicle", // Ensure the reference is correctly handled
                    },
                    bankDetails: {
                      reference: "Bank",
                    },
                    wallet: {
                      reference: "Wallet",
                    },
                    // wallet: {
                    //   reference: "Wallet", // Ensure the reference is correctly handled
                    // },
                    // subscription: {
                    //   reference: "UserSubscription", // Ensure the reference is correctly handled
                    // },
                    files: {
                      reference: "File", // Ensure the reference is correctly handled
                    },
                  },
                  // additional options can be specified here
                },
              },
              {
                resource: Vehicle,
                options: {
                  // additional options can be specified here
                  owner: {
                    reference: "User",
                  },
                  files: {
                    reference: "File", // Ensure the reference is correctly handled
                  },
                },
              },
              {
                resource: Bank,
                options: {
                  // additional options can be specified here
                },
              },
              {
                resource: Wallet,
                options: {
                  // additional options can be specified here
                },
              },
              {
                resource: File,
                options: {
                  // additional options can be specified here
                },
              },
            ],
          };

          const admin = new AdminJS(adminOptions);
          console.log("AdminJS instance created with options:", adminOptions);

          const adminRouter = AdminJSExpress.buildRouter(admin);
          console.log("Admin router created");

          app.use(admin.options.rootPath, adminRouter);

          app.listen(PORT, () => {
            console.log(
              `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`,
            );
          });
        } catch (error) {
          console.error("Error starting the application:", error);
        }
      };

      start();
    },
  )
  .catch(error => {
    console.error("Error loading modules:", error);
  });

const PORT = 3000;

// app.listen(9090, () => console.log(`Server running on port ${port}`));
