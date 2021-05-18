const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
const d3scale = require('d3-scale-chromatic');
const d3geo = require('d3-geo-projection');

const width = 900;
const height = 600;

class D3Choropleth extends D3Component {
  initialize(node, props) {
    // The svg
    const svg = (this.svg = d3.select(node).append('svg')
      .attr("width", width)
      .attr("height", height)
    );

    // Color scale
    var colorScale = d3.scaleLinear()
      .domain([0,100])
      .range(d3.schemeBuPu[7]);

    // Hover functions
    // function handleMouseOver(d, i) {
    //   d3.select(this)
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 1)
    //     .style("stroke", "black")
    //     .attr("fill", "red")
    // }
    // function handleMouseLeave(d, i) {
    //   d3.select(this)
    //     .transition()
    //     .duration(200)
    //     .style("stroke", "transparent")
    // }

    // Map and projection
    const projection = d3.geoMercator()
      .scale(50000)
      .center([-122.10, 47.61])
      .translate([width / 2, height / 2])

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/cse412-21sp/transportation-accessibility/main/data/king_county_block_groups.geojson").then( function(data) {
        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
                .attr("d", d3.geoPath()
                  .projection(projection)
                )
                .attr("fill", function (d) {
                  d.metric = props.data.find(element=>element.GEOID==parseInt(d.properties.GEOID)) || 0;
                  return colorScale(d.metric.num_stops);
                })
                .attr("class", function(d){
                  return "BlockGroup"
                })
                .style("stroke", "#fff")
                // .on("mouseover", handleMouseOver)
                // .on("mouseleave", handleMouseLeave)
    })
  }

  update(props, oldProps) {
    // Use this function to update the visualization.
    // The initial SVG element can be accessed with: this.svg

    // this.svg.selectAll('line')
    //   .transition()
    //   .duration(750)
    //   .attr('color', '#ccc');
  }
}

module.exports = D3Choropleth;