"use strict";

const express = require('express'),
	router = express.Router();

router.use('/city', require('./city.js'));
router.use('/country', require('./country.js'));
router.use('/weather', require('./weather.js'));

module.exports = router;
