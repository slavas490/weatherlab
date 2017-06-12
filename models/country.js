module.exports = function(mongoose){
	let countrySchema = new mongoose.Schema({
		name: { type: String, index: { unique: true }}
	});

	return mongoose.model('country', countrySchema);
};