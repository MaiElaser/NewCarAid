const express = require('express');
const router = express.Router();
const { createSubscriptionPlan, subscribeUser, getUserSubscription, getAllSubscriptionPlan, deleteSubscriptionPlan, updateSubscriptionPlan, getAllUserSubscription,deleteUserSubscriptions,unSubscribe } = require('../controllers/subscriptionController');
const  validateToken  = require('../middleware/validateTokenHandler');

// Ensure the functions are correctly imported and exist
router.post('/createPlan', createSubscriptionPlan);
router.post('/subscribe', validateToken, subscribeUser);
router.delete('/unSubscribe', validateToken, unSubscribe);
router.get('/mySubscription', validateToken, getUserSubscription);
router.get('/getAllSubscriptionPlan', validateToken, getAllSubscriptionPlan);
router.get('/getAllUserSubscription', getAllUserSubscription);
router.delete('/deleteSubscriptionPlan/:id', deleteSubscriptionPlan);
router.delete('/deleteUserSubscriptions', validateToken,deleteUserSubscriptions);
router.put('/updateSubscriptionPlan/:id', updateSubscriptionPlan);

console.log("createSubscriptionPlan:", createSubscriptionPlan);
console.log("subscribeUser:", subscribeUser);
console.log("getUserSubscription:", getUserSubscription);


module.exports = router;
