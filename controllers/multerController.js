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





