const asyncHandler = require("express-async-handler");
const geocode = require("../utils/geocode");

// Geocode an address
const geocodeAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    res.status(400);
    throw new Error("Please provide an address");
  }

  try {
    console.log('Request received for address:', address); // Log the received address
    const { lat, lng } = await geocode(address);
    console.log('Geocoding successful:', { lat, lng }); // Log the successful geocoding result
    res.status(200).json({ lat, lng });
  } catch (error) {
    console.error('Geocoding failed:', error.message); // Log the error message
    res.status(500).json({ message: "Failed to geocode address" });
  }
});

module.exports = {
  geocodeAddress,
};

