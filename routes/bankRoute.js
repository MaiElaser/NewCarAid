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
router.put('/updateBankDetails/:bankDetailsId', validateToken, bankController.updateUserBankDetails);
router.get('/getBankDetails', validateToken, bankController.getBankDetails);
router.get('/getBankDetailsByCardNumber/:id', validateToken, bankController.getBankDetailsByCardNumber);
router.post('/addUserBankDetails', validateToken, bankController.addUserBankDetails);
router.delete('/deleteUserBankDetails/:id', validateToken, bankController.deleteUserBankDetails);

module.exports = router;

