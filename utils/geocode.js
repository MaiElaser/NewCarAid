const axios = require("axios");

const geocode = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log('Geocoding response:', response.data); // Log the response data
    if (response.data.status !== "OK") {
      throw new Error(`Geocoding API error: ${response.data.status}, ${response.data.error_message}`);
    }
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error(`Geocoding API error: ${error.message}`);
    throw new Error("Failed to geocode address");
  }
};

module.exports = geocode;



