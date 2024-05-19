/*const UploadedFile = require ("../models/fileUploadModel");
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

*/
const File = require("../models/fileUploadModel");
const Vehicle = require("../models/vehicleModel");

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, filename, path, size, mimetype } = req.file;
    const { vehicleId } = req.body; // Expecting vehicleId to be sent in the request body

    if (!vehicleId) {
        return res.status(400).json({ message: 'vehicleId is required' });
    }

    try {
        // Create the file document
        const file = new File({
            originalname,
            filename,
            path,
            size,
            mimetype
        });

        await file.save();

        // Associate the file with the vehicle
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Initialize the files array if not present
        if (!vehicle.files) {
            vehicle.files = [];
        }

        vehicle.files.push(file._id);
        await vehicle.save();

        res.json({ message: 'File uploaded and associated with vehicle successfully', file, vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadFile,
};





