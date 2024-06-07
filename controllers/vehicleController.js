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
const mongoose = require('mongoose')
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');

 // Assuming you have a Vehicle model

exports.getAllVehiclesForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const vehicles = await Vehicle.find({ owner: userId });
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'An error occurred while fetching vehicles' });
    }
};


exports.getAllVehicle = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'An error occurred while fetching vehicles' });
    }
};

exports.addVehicle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plateNo } = req.body;

    
    if(req.user.role.toLowerCase().replace(/\s+/g, '') === "carowner"  ){

    

    const existingVehicle = await Vehicle.findOne({ plateNo });
    if (existingVehicle) {
        return res.status(400).json({ error: 'A vehicle with this plate number already exists' });
    }


    const newVehicle = new Vehicle({ ...req.body, owner: userId });
    await newVehicle.save();

    await User.findByIdAndUpdate(userId, { $push: { vehicles: newVehicle._id } });

    res.status(201).json(newVehicle);
  }else{
    console.log("Your role doesn't support adding vehicles")
    res.status(403).json("Your role doesn't support adding vehicles")
  }
} catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'An error occurred while adding the vehicle' });
}
};

exports.updateVehicle = async (req, res) => {
    try {
      if(req.user.role.toLowerCase().replace(/\s+/g, '') === "carowner"  ){
        const vehicleId = req.params.id;
        const updates = req.body;
        const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, updates, { new: true });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
      }else{
        console.log("Your role doesn't support updating vehicles")
        res.status(403).json("Your role doesn't support updating vehicles")
      }
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ error: 'An error occurred while updating the vehicle' });
    }
};

exports.deleteVehicle = async (req, res) => {
  try {
      const vehicleId = req.params.id;
      if(req.user.role.toLowerCase().replace(/\s+/g, '') === "carowner"  ){
      if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
          console.error('Invalid vehicle ID:', vehicleId);
          return res.status(400).json({ error: 'Invalid vehicle ID' });
      }

      console.log("Vehicle ID:", vehicleId);

      const vehicle = await Vehicle.findById(vehicleId);
      console.log("Vehicle found:", vehicle);

      if (!vehicle) {
          console.error('Vehicle not found for ID:', vehicleId);
          return res.status(404).json({ error: 'Vehicle not found' });
      }

      if (vehicle.owner.toString() !== req.user.id) {
          console.error('Unauthorized deletion attempt by user:', req.user.id);
          return res.status(403).json({ error: 'Unauthorized to delete this vehicle' });
      }

      const userUpdateResult = await User.findByIdAndUpdate(vehicle.owner, { $pull: { vehicles: vehicleId } });
      if (!userUpdateResult) {
          console.error('Failed to update user vehicles array for user:', vehicle.owner);
          return res.status(500).json({ error: 'Failed to update user vehicles array' });
      }
      console.log(`Removed vehicle ID ${vehicleId} from user ${vehicle.owner}`);

      const vehicleDeleteResult = await Vehicle.findByIdAndDelete(vehicleId);
      if (!vehicleDeleteResult) {
          console.error('Failed to delete vehicle with ID:', vehicleId);
          return res.status(500).json({ error: 'Failed to delete vehicle' });
      }
      console.log(`Vehicle ID ${vehicleId} deleted successfully`);

      res.json({ message: 'Vehicle deleted successfully' });
    }else{
      console.log("Your role doesn't support deleting vehicles")
      res.status(403).json("Your role doesn't support deleting vehicles")
    }
  } catch (error) {
      console.error('Error in catch block:', error);
      res.status(500).json({ error: 'An error occurred while deleting the vehicle' });
  }
};




exports.getVehicleDetails = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    res.status(500).json({ message: 'An error occurred while fetching vehicle details' });
  }
};
