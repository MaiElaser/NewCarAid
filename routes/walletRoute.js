const express = require('express');
const { getWalletBalance, addFunds, withdrawFunds } = require('../controllers/walletController');

const router = express.Router();

router.get('/wallet/:userId', getWalletBalance);
router.post('/wallet/:userId/add', addFunds);
router.post('/wallet/:userId/withdraw', withdrawFunds);

module.exports = router;
