import * as d3 from 'd3';
import getTribColors from './getTribColors.js'

// import * as _ from 'lodash';


function scatterline(data, category, container){
	console.log('drawing scatterline >>>>>>>>>>');
	console.log(category);

	// const container = d3.select(container);
	
	const bbox = d3.select(container).node().getBoundingClientRect(),
		circleRadius = 8,
		height=bbox.height,
		width=bbox.width,
		margin={top:0,right:50,bottom:25,left:50},
		innerHeight = height - margin.top - margin.bottom,
		innerWidth = width - margin.right - margin.left;

	const axisFormat = category == "year_built" ? "d" : ",";

	const extent = d3.extent(data, d => parseInt(d[category]));
	
	console.log(extent);
	
	const scatterScale = d3.scaleLinear()
		.domain(extent)
		.range([0,innerWidth])
		.nice();

	const xAxis = d3.axisBottom(scatterScale)
	    .tickSize(circleRadius * 2)
	    .tickFormat(d3.format(axisFormat));

	// ----------------------------------
	// START MESSING WITH SVGs
	// ----------------------------------

	//Inserts svg and sizes it
	const svg = d3.select(container)
		.append("svg")
        .attr("width", width)
        .attr("height", height);

	const chartInner = svg.append('g')
		.classed('chartInner', true)
		.attr("width",innerWidth)
		.attr("height",innerHeight)
		.attr(`transform`,`translate(${margin.left},${margin.top})`);

	svg.append('g')
		.classed('x', true)
		.classed('axis', true)
		.attr(`transform`,`translate(${margin.left},${margin.top + innerHeight / 2})`)
		.call(xAxis);

	
	chartInner.append('line')
		.classed('scatterline__line', true)
		.attr('x1', 0)
		.attr('x2', innerWidth)
		.attr('y1', innerHeight / 2)
		.attr('y2', innerHeight / 2)
		.style('stroke', 'black')
		.style('stroke-width', 1);

	chartInner.selectAll('circle')
		.data(data)
		.enter()
			.append('circle')
			.classed('scatterline__circle', true)
			.attr('r', circleRadius)
			.style('fill', getTribColors('trib-blue2'))
			.style('opacity', .3)
			.attr('cx', d => scatterScale(d[category]))
			.attr('cy', innerHeight / 2)
			.attr('data-value', d => d[category]);
	
}

module.exports = scatterline;