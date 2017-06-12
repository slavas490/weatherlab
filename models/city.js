module.exports = function(mongoose){
	let Schema  = mongoose.Schema;

	let citySchema = new mongoose.Schema({
		country: { type: Schema.Types.ObjectId, ref: 'country' },
		name: String,
		coord: {
			lon: Number,
			lat: Number
		}
	});

	citySchema.methods.getCountry = function(){
		let country_id = this.country;

		return new Promise(function(response, reject){
			mongoose.models.country.findById(country_id, function(err, out){
				if(err){
					reject(err);
				}
				else{
					response(out);
				}
			});
		})
	}

	return mongoose.model('city', citySchema);
};