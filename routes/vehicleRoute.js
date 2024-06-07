// routes/vehicleRoute.js
const express = require('express');
const { getAllVehiclesForUser, addVehicle, updateVehicle, deleteVehicle, getAllVehicle, getVehicleDetails } = require('../controllers/vehicleController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();

router.get('/getAllVehiclesForUser', validateToken, getAllVehiclesForUser);
router.get('/getAllVehicle', validateToken, getAllVehicle);
router.post('/addNewVehicle',validateToken,  addVehicle);
router.put('/updateVehicle/:id', validateToken, updateVehicle);
router.delete('/removeVehicle/:id', validateToken, deleteVehicle);
router.get('/getVehicle/:vehicleId', validateToken, getVehicleDetails);

module.exports = router;
