const UploadedFile = require ("../models/fileUploadModel");
const upload = require('../config/multerConfig');
const mongoose = require("mongoose");

const uploadFile = (req, res) => {
  if (req.file) {
    // File was uploaded successfully
    const filename = req.file.originalname;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const filePath = req.file.path; // Path where the file is saved on the server

    // Perform further processing or save file details to database
    // For example, you might save the file details to a database or return them in the response
    res.status(200).json({ 
      message: 'File uploaded successfully', 
      filename,
      fileSize,
      mimeType,
      filePath 
    });
  } else {
    // No file uploaded
    res.status(400).json({ error: 'No file uploaded' });
  }
};
module.exports = { uploadFile };

