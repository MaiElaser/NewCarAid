const express = require('express');
const router = express.Router();
const { createSubscriptionPlan, subscribeUser, getUserSubscription } = require('../controllers/subscriptionController');
const  validateToken  = require('../middleware/validateTokenHandler');

// Ensure the functions are correctly imported and exist
router.post('/createPlan', createSubscriptionPlan);
router.post('/subscribe', validateToken, subscribeUser);
router.get('/mySubscription', validateToken, getUserSubscription);

console.log("createSubscriptionPlan:", createSubscriptionPlan);
console.log("subscribeUser:", subscribeUser);
console.log("getUserSubscription:", getUserSubscription);


module.exports = router;
