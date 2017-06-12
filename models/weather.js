module.exports = function(mongoose){
	let weatherSchema = new mongoose.Schema({
		id: Number,
		name: String,
		img_id: Number
	});

	return mongoose.model('weather', weatherSchema);
};