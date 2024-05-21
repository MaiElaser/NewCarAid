const express = require("express");
const router = express.Router();
const { geocodeAddress } = require("../controllers/locationController");

router.get("/", geocodeAddress);

module.exports = router;
