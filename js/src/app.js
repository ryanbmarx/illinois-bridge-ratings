// import scatterLine from './scatter-line.js';
import histogram from './histogram.js';
import scatterline from './scatterline.js';
import illinoisCountyChoropleth from './illinois-choropleth.js';
import {csv} from 'd3';
import {json} from 'd3';





window.onload = function(){
	// console.log('window is onloaded', window.ROOT_URL);

	csv(`http://${window.ROOT_URL}/data/bridge-ratings.csv`, (err, data) => {
		if (err) throw err;
		// console.log(data);

		
		document.querySelectorAll('.chart--histogram').forEach(chart =>{
			let category = chart.dataset.chart;
			histogram(data, category, chart);	
		});

		document.querySelectorAll('.chart--scatterline').forEach(chart =>{
			const category = chart.dataset.chart;

			scatterline(data, category, chart);	
		});
	})

	json(`http://${window.ROOT_URL}/data/illinois-counties-with-ratings.geojson`, (err, geoData) => {
		const illMap = new illinoisCountyChoropleth({
			container: document.getElementById('map'),
			data: geoData,
			type: 'quantize', // "quantize" or "continuous"
			color: ["#CBDDED","#85B4D3","#7493C1", "#004E87"]
		
 		})
	})
}