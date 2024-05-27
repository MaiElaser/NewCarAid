const express = require('express');
const { searchMechanics, searchSparePartsShops, cancelSearch } = require('../controllers/searchController');

const router = express.Router();

router.get('/search-mechanics', searchMechanics);
router.get('/search-spare-parts', searchSparePartsShops);
router.post('/cancel-search', cancelSearch);

module.exports = router;
