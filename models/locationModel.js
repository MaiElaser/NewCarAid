const axios = require("axios");

const geocodeAddress = async (req, res) => {
    console.log('Geocode address request received'); // Add this line
  try {
    const { address } = req.query;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: "AIzaSyDzECHufr-21rHm65vnu_JJMLgHBubIpck", // Replace with your actual Google Maps API key
        },
      }
    );

    const { results } = response.data;
    if (results.length > 0) {
      const { formatted_address, geometry } = results[0];
      const { location } = geometry;

      const locationData = {
        name: address,
        address: formatted_address,
        latitude: location.lat,
        longitude: location.lng,
      };

      res.json({ success: true, location: locationData });
    } else {
      res.json({ success: false, message: "No results found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  geocodeAddress,
};
