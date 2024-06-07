const File = require("../models/fileUploadModel");
const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");

const uploadFile = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const { originalname, filename, path, size, mimetype } = req.file;
    const { documentType, vehicleId } = req.body; // Ensure documentType is included
    const userId = req.user.id; // Get user ID from the validated token
  
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
        mimetype,
        documentType, // Include this field
        userId: userId || null,
        vehicleId: vehicleId || null
      });
  
      await file.save();
  
      if (vehicleId) {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
          return res.status(404).json({ message: 'Vehicle not found' });
        }
  
        if (!vehicle.files) {
          vehicle.files = [];
        }
  
        vehicle.files.push(file._id);
        await vehicle.save();
  
        return res.json({ message: 'File uploaded and associated with vehicle successfully', file, vehicle });
      } else if (userId) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
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
  
  const uploadVehicleDocument = async (req, res) => {
    const { vehicleId } = req.params;
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const { originalname, filename, path, size, mimetype } = req.file;
    const documentType = req.body.documentType;
  
    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
  
      // Create the file document
      const file = new File({
        originalname,
        filename,
        path,
        size,
        mimetype,
        documentType,
        vehicleId
      });
  
      await file.save();
  
      // Associate the file with the vehicle
      vehicle.files.push(file._id);
      await vehicle.save();
  
      return res.json({ message: 'File uploaded and associated with vehicle successfully', file });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

const getFilesByUserId = async (req, res) => {
  const userId = req.user.id;
  console.log('User ID:', userId);

  try {
    const user = await User.findById(userId).populate('files');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Files retrieved successfully', files: user.files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getFilesByVehicleId = async (req, res) => {
    const { vehicleId } = req.params;
    console.log('vehicle ID:', vehicleId);
    try {
        const vehicle = await Vehicle.findById(vehicleId).populate('files');
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        return res.json({ message: 'Files retrieved successfully', files: vehicle.files });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  uploadFile,
  getFilesByVehicleId,
  getFilesByUserId,
  uploadVehicleDocument
};
