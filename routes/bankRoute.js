/*
// Import necessary modules and User model
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Assuming you have a User model
const {updateUserBankDetails} = require("../controllers/bankController");

router.post("/updateBankDetails", updateUserBankDetails);
// Export the router
module.exports = router;
*/
const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

// Import validateToken middleware from bankController
const { validateToken } = bankController;

// POST request to update bank details with validateToken middleware
router.post('/updateBankDetails', validateToken, bankController.updateUserBankDetails);

module.exports = router;

