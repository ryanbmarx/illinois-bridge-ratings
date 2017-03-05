var fs = require('fs');
var _ = require ('underscore');


// var csv is the CSV file with headers, 
// from http://techslides.com/convert-csv-to-json-in-javascript
// returns an array of JS objects

function csvJSON(csv){

  var lines=csv.split("\n");
  var result = [];

  var headers=lines[0].split(",");
  headers[headers.length-1] = headers[headers.length-1].replace('\r', '');
  
  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);
  }
  
  return result; //JavaScript object
  // return JSON.stringify(result); //JSON
}


// const urlDataToAppend = "https://docs.google.com/spreadsheets/d/1uKk1FgYL3ES94EPbMOYHLQCHQkBRFZZeHoBEki_DZX0/pub?gid=2059178675&single=true&output=csv"


fs.readFile(`./data/counties-ratings.csv`, 'utf8', (err, data) => {
	
	// This is our csv we want to insert into the geojson
	const dataToAppend = csvJSON(data);
	var keys = Object.keys(dataToAppend['0']);
	console.log('keys', keys)
	fs.readFile(`./data/illinois-counties.geojson`, 'utf8', (err, data) => {
		if (err) throw err;

		// this is the geojson
		const geoJsonData = JSON.parse(data);

		// For each feature in the geojson (state, county, etc.), do this ...
		geoJsonData.features.forEach((feature) => {
			
			console.log(`>> Looking for ${feature.properties.GEOID}`)
			
			const filteredDataToAppend = _.filter(dataToAppend, function(d) {
				if (d['FIPS'] == feature.properties.GEOID){
					return true
				}
				return d.FIPS == feature.properties.GEOID 
			});
			console.log('>> Found ', filteredDataToAppend);
			// Loop through the keys and add the key/value pair
			// to the properties object inside each GEOJSON feature
			keys.forEach((val, idx)=>{
				console.log(val, feature.properties[val], filteredDataToAppend[0][val])
				feature.properties[val] = filteredDataToAppend[0][val];
			})
		})

		fs.writeFile(`./data/illinois-counties-with-ratings.geojson`, JSON.stringify(geoJsonData), (err) => {
			if(err) {
				return console.log(err);
			} else {
				return console.log('done writing file');
			}
		}); 
	});
})

