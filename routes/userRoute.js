const express = require("express");
const { registerUser, currentUser, loginUser, forgetPassword, resetPassword, registerVehicle,} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const { reset } = require("nodemon");

const router = express.Router();
router.post("/register", registerUser); 
router.post("/login", loginUser);
router.get("/current", validateToken , currentUser);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);
router.post('/registerVehicle', validateToken, registerVehicle);




module.exports = router;