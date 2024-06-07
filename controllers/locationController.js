const axios = require("axios");
require('dotenv').config();

const geocodeAddress = async (req, res) => {
    console.log('Geocode address request received'); // Log the request
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ success: false, message: "Address is required" });
        }

        console.log('Requesting geocode for address:', address); // Log the address

        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address: address,
                    key: process.env.GOOGLE_MAPS_API_KEY, // Use environment variable for API key
                },
            }
        );

        console.log('Google Maps API response:', response.data); // Log the raw response

        const { results, status } = response.data;
        if (status !== 'OK') {
            console.error('Error from Google Maps API:', status);
            return res.status(500).json({ success: false, message: `Google Maps API error: ${status}` });
        }

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
            res.status(404).json({ success: false, message: "No results found" });
        }
    } catch (error) {
        console.error('Error occurred during geocoding:', error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    geocodeAddress,
};
