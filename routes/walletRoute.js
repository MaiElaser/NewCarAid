const express = require('express');
const { getWalletBalance, addFunds, withdrawFunds, createWalletForUser, deleteWalletForUser } = require('../controllers/walletController');
const  validateToken  = require('../middleware/validateTokenHandler');

const router = express.Router();

router.get('/getWalletBalance',validateToken, getWalletBalance);
router.post('/addFunds',validateToken, addFunds);
router.post('/withdraw',validateToken, withdrawFunds);
router.post('/createWalletForUser',validateToken, createWalletForUser);
router.delete('/deleteWalletForUser',validateToken, deleteWalletForUser);

module.exports = router;

