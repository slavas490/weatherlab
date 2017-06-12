"use strict";

const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    cors = require('express-cors'),
    mongolib = require('mongolib'),
    app = express();

// settings
app.use(cors({ allowedOrigins: [ 'http://localhost:8008' ] }));
mongolib.setModelsPath('./models');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'views/dist')));
app.use('/api', routes);

// not api request
app.use((req, res) => {
	res.send(400, {code: 1, err: "Wrong request"});
});

app.listen(3000)

// *****
// const fs = require('fs')
// fs.readFile('city.list.json', function(err, data){
//     let list = JSON.parse(data), i=0

//     function next(){
//         let line = list[i]
//         i++;
//         console.log(i)

//         mongolib.models.country.findOne({name: line.country}, function(err, dbl){
//             if(!dbl) next()
//             else{
//                 let c = new mongolib.models.city({name: line.name, country: dbl._id, coord: {lon: line.coord.lon, lat: line.coord.lat}})
//                 c.save(function(){
//                     if(i<list.length-1){
//                         next()
//                     }
//                     else{
//                         console.log("DONE")
//                     }
//                 })
//             }
//         })
//     }

//     next();
// })
