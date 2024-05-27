const express = require('express');
const { getWalletBalance, addFunds, withdrawFunds } = require('../controllers/walletController');

const router = express.Router();

router.get('/:userId', getWalletBalance);
router.post('/:userId/add', addFunds);
router.post('/:userId/withdraw', withdrawFunds);

module.exports = router;

