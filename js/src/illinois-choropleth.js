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


class illinoisCountyChoropleth{

	constructor(options){
		const app = this;
		app.options = options;
		const data = app.options.data;
		const mapContainer = d3.select(app.options.container);

		console.log(data);

		const containerBox = mapContainer.node().getBoundingClientRect(),
			height = containerBox.height,
			width = containerBox.width;
			
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
					.style('fill', '#eee')
					.style('stroke', '#888')
					.style('stroke-width', 1)
					.attr( "d", geoPath);
	}

}


module.exports = illinoisCountyChoropleth;