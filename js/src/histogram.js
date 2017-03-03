import * as d3 from 'd3';
import countBy from 'lodash.countby';
// import {filter} from 'lodash.filter';

import getTribColors from './getTribColors.js'
import barChart from './bar-chart.js'

function generateHistogramData(rawData, category){
	
	// // Start by filtering down to the Chicago area
	// let tempData = filter(rawData, d => {
	// 	const county = d.county.toUpperCase();
	// 	if (county == "COOK" || county == "WILL" || county == "DUPAGE" || county == "MCHENRY" || county == "LAKE" || county == "KANE"){
	// 		return true;
	// 	}
	// 	return false;
	// })

	// Start by aggregating the data into frequency data by the specified category.
	let tempData = countBy(rawData, category);

	// countBy won't know if there are any ratings missing, so we'll do a quick check. We want a bar 
	// for each of the 8 ratings and n/a even if any of those values is zero.
	// This array order also will be the order in which the bars are rendered
	const ratings = ["N","F", 1,2,3,4,5,6,7,8];

	ratings.forEach(rating => {
		if (!(tempData[rating] > 0)){
			tempData[rating] = 0;
		}
	});

	// Now, to make this a proper chart, D3 needs an iterable object, 
	// so we'll transform the data into an array of objects;

	let histData = [];
	ratings.forEach( rating => {
		histData.push({
			rating:rating,
			value:tempData[rating]
		});
	});


	return histData;
}


function histogram(rawData, category, container){
	const data = generateHistogramData(rawData, category);
	console.log(data);
	const hist = new barChart({
		root_url:window.ROOT_URL,
		chartType:'bar',
		container:container,
		dataset:data,
		yAttribute:'value',
		xAttribute:'rating',
		transitionTime:150,
		innerMargins:{top:45,right:0,bottom:40,left:0},
		barPadding: 0.01,
		barFill:'trib-blue2',
		barLabels:true,
		startAtZero:true,
		maxYValue:250,
		showYAxis:false,
		xTicks:{
			// At these breakpoints, only run a tick every nth time. The value is the interval.
			mobile:5,
			tablet:2,
			desktop:1
		},
		meta:{
			headline:category,
			// yAxisLabel: "Tests exceeding 500ml",
			// xAxisLabel: "Testing station ID",
			// sources: "Source: City of Chicago Wastewater Management and Reclamation District",
			// credit: "ChiTribGraphics"
		}
	});

	console.log(data);

}


module.exports = histogram;