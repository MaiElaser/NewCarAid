const express = require('express');
const { uploadFile, getFilesByVehicleId, getFilesByUserId, uploadVehicleDocument } = require('../controllers/multerController');
const upload = require('../config/multerConfig');
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/upload', validateToken, upload.single('file'), (req, res) => {
    console.log('File upload request received:', req.file);
    console.log('Request body:', req.body);
    uploadFile(req, res);
});

router.post('/documents/:vehicleId', upload.single('file'), uploadVehicleDocument);



router.get('/documents', validateToken, getFilesByUserId);
router.get('/vehicle-documents/:vehicleId', validateToken, getFilesByVehicleId);

module.exports = router;
