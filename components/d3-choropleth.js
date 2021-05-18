const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 100;
const height = 600;
// Color scales for each variable
const colorScaleStops = d3.scaleLinear()
  .domain([10,75])
  .range(d3.schemeBuPu[9]);
const colorScaleRoutes = d3.scaleLinear()
  .domain([1,2])
  .range(d3.schemeBuPu[9]);
const colorScaleFreq = d3.scaleLinear()
  .domain([20,5])
  .range(d3.schemeBuPu[9]);
const colorScaleAccess = d3.scaleLinear()
  .domain([50,100])
  .range(d3.schemeBuPu[9]);

class D3Choropleth extends D3Component {
  initialize(node, props) {
    // The svg
    const svg = (this.svg = d3.select(node).append('svg')
      .style("width", width+'%')
      .style("height", height+'px')
      .style("border", '1px dashed #ccc')
    );

    // let metricValues = props.data.map(a => a.foo);

    // Hover functions
    function handleMouseOver(d, i) {
      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "black")
    }
    function handleMouseLeave(d, i) {
      d3.select(this)
        .style("opacity", .8)
        .style("stroke", "Ivory")
    }

    // Map and projection
    const projection = d3.geoMercator()
      .scale(90000)
      .center([-122.60, 47.61])
      .translate([width / 2, height / 2])

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/cse412-21sp/transportation-accessibility/main/data/king_county_block_groups.geojson").then( function(data) {
        // Draw the map
        console.log(props.data);
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
                .attr("d", d3.geoPath()
                  .projection(projection)
                )
                .attr("fill", function (d) {
                  d.values = props.data.find(element=>element.GEOID==parseInt(d.properties.GEOID)) || 0;
                  switch (props.accessMetric) {
                    case "num_stops":
                      return colorScaleStops(d.values.num_stops)
                    case "avg_num_routes_per_stop":
                      return colorScaleRoutes(d.values.avg_num_routes_per_stop)
                    case "avg_route_frequency":
                      return colorScaleFreq(d.values.avg_route_frequency)
                    case "avg_accessible_stops":
                      return colorScaleAccess(d.values.avg_accessible_stops)
                  }
                })
                .attr("class", function(d){
                  return "BlockGroup"
                })
                .style("stroke", "Ivory")
                .on("mouseover", handleMouseOver)
                .on("mouseleave", handleMouseLeave)
    })
  }

  update(props, oldProps) {
    // Use this function to update the visualization.
    // The initial SVG element can be accessed with: this.svg
    this.svg.selectAll('.BlockGroup')
    .attr("fill", function (d) {
      d.values = props.data.find(element=>element.GEOID==parseInt(d.properties.GEOID)) || 0;
      switch (props.accessMetric) {
        case "num_stops":
          return colorScaleStops(d.values.num_stops)
        case "avg_num_routes_per_stop":
          return colorScaleRoutes(d.values.avg_num_routes_per_stop)
        case "avg_route_frequency":
          return colorScaleFreq(d.values.avg_route_frequency)
        case "avg_accessible_stops":
          return colorScaleAccess(d.values.avg_accessible_stops)
      }
    })
  }
}

module.exports = D3Choropleth;