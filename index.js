
const fs = require('fs');
const express = require('express');
var inside = require('point-in-polygon');

const app = express();
const PORT = 5000; //.env.PORT || 5000
var Features =[];

var data = fs.readFileSync('gisInit.json','utf-8');
var gis=JSON.parse(data.toString());
gis.features.forEach(fe=>{
 Features.push(fe);
});

express()
  .use(express.json())
  .get('/gis/testpoint', (req, res) => {
    var Result={ polygons:[]};
    try {
      var point=[parseFloat(req.query.lat), parseFloat(req.query.long)];
      Features.forEach (feature=>{
        feature.geometry.coordinates.forEach(cord=>{
          if(inside(point,cord))
             Result.polygons.push(feature.properties.name);
        })
      })
      res.json(Result);
    } catch (error) {
      res.sendStatus(404); //Not Found
    }
  })
  .put('/gis/addpolygon', (req, res) => {
    try {
      Features.push(req.body);
      res.sendStatus(200);//send OK 
    } catch (error) {
      res.sendStatus(403);//send Forbidden  
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
