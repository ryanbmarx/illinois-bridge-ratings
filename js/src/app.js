import scatterLine from './scatter-line.js';
import histogram from './histogram.js';
import {csv} from 'd3';





window.onload = function(){
	console.log('window is onloaded');

	csv(`http://${window.ROOT_URL}/data/bridge-ratings.csv`, (err, data) => {
		if (err) throw err;
		console.log(data);

		
		document.querySelectorAll('.chart--histogram').forEach(chart =>{
			let category = chart.dataset.chart;
			histogram(data, category, chart);	
		});

		
	})
}