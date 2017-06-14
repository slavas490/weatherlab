const express = require('express'),
	app = express(),
	mongolib = require('mongolib'),
	router = express.Router(),
	request = require('request');

function getTimeFrom(hour=0){
	let time = new Date();
		// time = new Date(time.getTime() + time.getTimezoneOffset() * 60000);
		time.setHours(hour,0,0,0);
		time = parseInt(time/1000);

	return time;
}

function removeOld(){
	let ntime = new Date();
		// ntime = new Date(ntime.getTime() + ntime.getTimezoneOffset() * 60000);
		ntime = parseInt(ntime/1000);

	let db = mongolib.models.history;

	db.find({ time: {$lte: ntime} })
		.remove()
		.exec();
}

setInterval(removeOld, 10800000);

router.get('/info', (req, res) => {
	let db = mongolib.models.weather;

	db.find({}, function(err, list){
		if(list){
			res.send({code:0, list: list});
		}
		else{
			res.send({code: 1});
		}
	});
});

router.get('/:city_id', (req, res, next) => {
	let db = mongolib.models;
	let city_id = req.params.city_id;
	let time = getTimeFrom();
	let cityInfo = {};

	db.city.findById(city_id).populate('country').exec(function(err, city){
		if(!city){
			res.send({code: 1, err: "City cannot be found"});
			return false;
		}
		else{
			cityInfo = city;
			return db.history.find({ city: city._id, time: {$gte: time} });
		}
	})
	.then((err, list)=>{
		if(list && list.length >= 35){
			let out = {
				list: list,
				lon: cityInfo.coord.lon,
				lat: cityInfo.coord.lat,
				tds: getTimeFrom()
			};

			res.send({code: 0, list: out});
		}
		else{
			let start_from = list&&list.length ? list[list.length-1].time : null;
			request('http://api.openweathermap.org/data/2.5/forecast?q='+cityInfo.name+','+cityInfo.country.name+'&units=metric&appid=ff1115dc01cba0aaf989143a520008a1', function (error, response, body) {
				if(!error){
					let wlist = JSON.parse(body).list;
					let out_list = { lon: cityInfo.coord.lon, lat: cityInfo.coord.lat, list: [], tds: time };

					for(let i=0;i<wlist.length;i++){
						let wline = new db.history({ city: cityInfo._id,
													 time: wlist[i].dt,
													 temp: wlist[i].main.temp,
													 pressure: parseFloat(wlist[i].main.pressure*0.75006375).toFixed(2),
													 humidity: wlist[i].main.humidity,
													 weather: wlist[i].weather[0].id,
													 clouds: wlist[i].clouds.all,
													 wind_speed: wlist[i].wind.speed,
													 wind_deg: wlist[i].wind.deg});

						out_list.list.push(wline);

						if(wlist[i].dt>start_from){
							wline.save();
						}
					}

					res.send({code: 0, list: out_list});
				}
				else{
					res.send({code: 1}); // something went wrong
				}
			});
		}
	});
});

module.exports = router;
