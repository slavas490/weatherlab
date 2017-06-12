"use strict";

const express = require('express'),
	app = express(),
	mongolib = require('mongolib'),
	router = express.Router();


router.get('/:country_id/:name?', (req, res, next) => {
	let db = mongolib.models.city;

	db.find({'name': new RegExp('^'+req.params.name, 'i'), 'country': req.params.country_id})
		.sort('name')
		.limit(5)
		.exec(function(err, list) {
		    res.send({code: 0, list: list});
		});
});

module.exports = router;
