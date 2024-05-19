const express = require('express');
const multerController = require('../controllers/multerController');
const UploadedFile = require ("../models/fileUploadModel");
const upload = require('../config/multerConfig');
const router = express.Router();

// POST route for file upload
router.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded:', req.file); // Log the uploaded file info
  multerController.uploadFile(req, res); // Call the controller function
});

module.exports = router;



