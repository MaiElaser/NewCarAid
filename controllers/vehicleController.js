/*
const registerVehicle = asyncHandler(async (req, res) => {
    const { carType, brand, model, manufacturer, plateNo, color } = req.body;
  
    if (!carType || !brand || !model || !manufacturer || !plateNo || !color) {
      return res.status(400).json({ error: "Please fill all the required fields!" });
    }
  
    try {
      // Fetch the user based on the decoded token's user ID
      const user = await User.findById(req.user.id);
  
      if (!user) {
        console.log("User not found in database.");
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the user is a Car Owner
      if (user.category !== 'Car Owner') {
        return res.status(403).json({ error: "Only Car Owners are allowed to register vehicles" });
      }
  
      // Create a new vehicle with the owner field set to the current user's ID
      const vehicle = await Vehicle.create({
        carType,
        brand,
        model,
        manufacturer,
        plateNo,
        color,
        owner: req.user._id,
      });
  
      // Update the user's vehicles array with the new vehicle ID
      user.vehicles.push(vehicle._id);
      await user.save();
  
      return res.status(201).json({
        _id: vehicle._id,
        carType,
        brand,
        model,
        manufacturer,
        plateNo,
        color,
        owner: req.user._id,
      });
    } catch (error) {
      console.error("Error creating vehicle:", error);
      return res.status(500).json({ error: "Failed to register vehicle" });
    }
  });
*/

// controllers/vehicleController.js

const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');

 // Assuming you have a Vehicle model

exports.getVehicle = async (req, res) => {
    try {
        const userId = req.user.id;
        const vehicles = await Vehicle.find({ userId });
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'An error occurred while fetching vehicles' });
    }
};

exports.addVehicle = async (req, res) => {
    try {
        const userId = req.user.id;
        const newVehicle = new Vehicle({ ...req.body, userId });
        await newVehicle.save();
// Update the user's vehicles array
await User.findByIdAndUpdate(userId, { $push: { vehicles: newVehicle._id } });

        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).json({ error: 'An error occurred while adding the vehicle' });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const updates = req.body;
        const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, updates, { new: true });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'An error occurred while updating the vehicle' });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findByIdAndDelete(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

         // Remove the vehicle from the user's vehicles array
         await User.findByIdAndUpdate(vehicle.owner, { $pull: { vehicles: vehicle._id } });
         
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ error: 'An error occurred while deleting the vehicle' });
    }
};
