const axios = require('axios');

const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const searchPlaces = async (req, res, type, keyword) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                key: API_KEY,
                location: `${latitude},${longitude}`,
                radius: 5000, // search radius in meters
                type,
                keyword,
            }
        });

        const places = response.data.results;
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'An error occurred while searching for places' });
    }
};

const searchMechanics = (req, res) => {
    searchPlaces(req, res, 'car_repair', '');
};

const searchSparePartsShops = (req, res) => {
    searchPlaces(req, res, 'store', 'car parts');
};

const cancelSearch = (req, res) => {
    // In a real scenario, you'd manage search tokens or jobs here.
    res.json({ message: 'Search cancelled successfully' });
};

module.exports = { searchMechanics, searchSparePartsShops, cancelSearch };

