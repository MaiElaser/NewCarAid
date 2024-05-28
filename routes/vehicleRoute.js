// routes/vehicleRoute.js
const express = require('express');
const { getVehicle, addVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();

router.get('/', validateToken, getVehicle);
router.post('/',validateToken,  addVehicle);
router.put('/', validateToken, updateVehicle);
router.delete('/:id', validateToken, deleteVehicle);

module.exports = router;
