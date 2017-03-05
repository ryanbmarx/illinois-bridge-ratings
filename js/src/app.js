// import scatterLine from './scatter-line.js';
import histogram from './histogram.js';
import illinoisCountyChoropleth from './illinois-choropleth.js';
import {csv} from 'd3';
import {json} from 'd3';





window.onload = function(){
	console.log('window is onloaded');

	csv(`http://${window.ROOT_URL}/data/bridge-ratings.csv`, (err, data) => {
		if (err) throw err;
		// console.log(data);

		
		document.querySelectorAll('.chart--histogram').forEach(chart =>{
			let category = chart.dataset.chart;
			// histogram(data, category, chart);	
		});
	})

	json(`http://${window.ROOT_URL}/data/illinois-counties.geojson`, (err, geoData) => {
		console.log(geoData);
		const illMap = new illinoisCountyChoropleth({
			container: document.getElementById('map'),
			data: geoData
			// type: // "quantize" or "continuous"
			// color: // "single hex for opacity" or "array of colors" for quantize
 		})
	})
}