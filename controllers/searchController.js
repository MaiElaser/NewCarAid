const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Generic function to search places using Google Maps API.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string} type - The type of place to search for.
 * @param {string} keyword - The keyword to use in the search.
 */

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
        console.error('Error fetching places:', error.message);
        res.status(500).json({ error: 'An error occurred while searching for places' });
    }
};
/**
 * Controller to search for car repair mechanics.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const searchMechanics = (req, res) => {
    searchPlaces(req, res, 'car_repair', '');
};
/**
 * Controller to search for car parts stores.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const searchSparePartsShops = (req, res) => {
    searchPlaces(req, res, 'store', 'car parts');
};
/**
 * Controller to handle search cancellation.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

const cancelSearch = (req, res) => {
    // In a real scenario, you'd manage search tokens or jobs here.
    res.json({ message: 'Search cancelled successfully' });
};

module.exports = { searchMechanics, searchSparePartsShops, cancelSearch };

