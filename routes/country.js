const express = require('express'),
	app = express(),
	mongolib = require('mongolib'),
	router = express.Router();


router.get('/', (req, res, next) => {
	let db = mongolib.models.country;

	db.find().sort("name").exec(function(error, list) {
		res.send({code: 0, list: list});
	});	
});

module.exports = router;
