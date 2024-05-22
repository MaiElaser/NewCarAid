const express = require('express');
const { uploadFile } = require('../controllers/multerController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/', upload.single('file'), uploadFile);

module.exports = router;



