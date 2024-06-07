const express = require('express');
const { getProfile, updateProfile, deleteProfile, getAllUsersCount, getRandomProfiles,getRandomMechanicProfiles, getMechanicProfile, getRandomSparePartsShops, changePassword } = require('../controllers/profileController');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.get('/getProfile', validateToken, getProfile);
router.get('/getAllUsersCount', validateToken, getAllUsersCount);
router.get('/getRandomProfiles', validateToken, getRandomProfiles);
router.put('/updateProfile', validateToken, updateProfile);
router.delete('/deleteProfile', validateToken, deleteProfile);
router.get('/getRandomMechanicProfiles',validateToken, getRandomMechanicProfiles);
router.get('/getRandomSparePartsShops',validateToken, getRandomSparePartsShops);
router.get('/getMechanicProfile/:id', validateToken, getMechanicProfile);
router.post('/changePassword', changePassword);

module.exports = router;
