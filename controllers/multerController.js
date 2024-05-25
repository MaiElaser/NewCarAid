const File = require("../models/fileUploadModel");
const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, filename, path, size, mimetype } = req.file;
    const { vehicleId, userId } = req.body; // Renamed UserId to userId for consistency

    // Check if both vehicleId and userId are provided
    if (vehicleId && userId) {
        return res.status(400).json({ message: 'Provide either vehicleId or userId, not both' });
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

        if (vehicleId) {
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

            return res.json({ message: 'File uploaded and associated with vehicle successfully', file, vehicle });
        } else if (userId) {
            // Associate the file with the user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Initialize the files array if not present
            if (!user.files) {
                user.files = [];
            }

            user.files.push(file._id);
            await user.save();

            return res.json({ message: 'File uploaded and associated with user successfully', file, user });
        } else {
            return res.status(400).json({ message: 'Provide either vehicleId or userId' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadFile,
};








