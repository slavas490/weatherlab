module.exports = function(mongoose){
	let Schema  = mongoose.Schema;
	
	let historySchema = new mongoose.Schema({
		id: Number,
		city: { type: Schema.Types.ObjectId, ref: 'city' },
		time: Number,
		temp: Number,
		pressure: Number,
		humidity: Number,
		weather: Number,
		clouds: Number,
		wind_speed: Number,
		wind_deg: Number
	});

	return mongoose.model('history', historySchema);
};