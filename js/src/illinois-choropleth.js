import * as d3 from 'd3';

/*

	Takes a data variable which includes full FIPS codes for each county and maps a chosen data field to the illinos county map


	*example:*

	const illMap = new illinoisCountyChorpleth({
		container:
		data:
		type: // "quantize" or "continuous"
		color: // "single hex for opacity" or "array of colors" for quantize
 	})


*/

function makeLegend(scale, container){
	const legend = container.append('dl')
		.classed('map__legend', true);

	// Establish the d3-format function we want
	const formatter = d3.format('.1%')

	// The colors in the map
	const buckets = scale.range();

	buckets.forEach( (bucket, idx) => {
		legend.append('dt')
			.append('span')
			.classed('map__legend-box', true)
			.style('background-color', scale(scale.invertExtent(bucket)[0]))
		let text = idx == 0 ? `Fewer than ${formatter(scale.invertExtent(bucket)[1])}` : `${formatter(scale.invertExtent(bucket)[0])} to ${formatter(scale.invertExtent(bucket)[1])}`;
		legend.append('dd')
			.html(text);
	})
}



class illinoisCountyChoropleth{

	constructor(options){
		const app = this;
		app.options = options;
		const data = app.options.data;
		const mapContainer = d3.select(app.options.container);

		console.log('map data', data);

		const containerBox = mapContainer.node().getBoundingClientRect(),
			height = containerBox.height,
			width = containerBox.width;
			

		// We're charting the percentage of deficient bridges, so we want the extent of deficient/total bridges
		const extent = d3.extent(data.features, d => {
			return (d['properties']['deficient'] / d['properties']['bridges']);
		});



		// Pull the color or color ramp from the options
		const colors = app.options.color
		console.log(colors.length, typeof(colors));
		let mapScale;

		if (app.options.type == "quantize"){
			console.log('quant');
			// If colors is an array, then use the quantize scale
			mapScale = d3.scaleQuantize()
				.domain(extent)
				.range(colors);
		} else if (app.options.type == "linear") {
			// If the colors isn't an array but a string, then check if it is just a string.
			mapScale = d3.scaleLinear()
				.domain(extent)
				.range([0,1]);
		} else {
			console.error("The color option must be either a hex string (linear scale) or an array of hex strings (quantize scale)");
		}

		makeLegend(mapScale, mapContainer);

		const svg = mapContainer.append('svg')
			.attr( "width", width )
			.attr( "height", height );

		/*
		 * Uses method of generating projection by Bostock from this Stack Overflow question:	
		 * http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
		 */

		// Create a unit projection.
		let projection = d3.geoMercator()
			.scale(1)
			.translate([0, 0]);

		const geoPath = d3.geoPath().projection(projection);

		// Compute the bounds of a feature of interest, then derive scale & translate.
		const bounds = geoPath.bounds(data),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			s = 1 / Math.max(dx / width, dy / height),
			t = [width / 2 - s * x, (height / 2 - s * y)];

		projection
			.scale(s)
			.translate(t);

		svg.append('g')
			.classed('counties', true)


		const countyPolygons = svg.select('.counties')
			.selectAll( "path" )
			.data(data.features)
			.enter()
				.append('path')
					.style('fill', d => {
						console.log(d);
						return mapScale(d.properties.deficient / d.properties.bridges)
					})
					.style('stroke', '#fefefe')
					.style('stroke-width', 1)
					.attr( "d", geoPath);
	}

}


module.exports = illinoisCountyChoropleth;