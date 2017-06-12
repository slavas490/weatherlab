const mongoose = require('mongoose'),
	fs = require('fs'),
	path = require('path');

mongoose.connect('mongodb://localhost/weatherlab');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports.setModelsPath = function(MODELS_PATH) {
	if(MODELS_PATH){
		fs.readdir(MODELS_PATH, (err, files) => {
			files.forEach(file => {
				require(path.join(__dirname+"/../../"+MODELS_PATH, file))(mongoose);
			});
		});
	}
};

module.exports.models = mongoose.models;