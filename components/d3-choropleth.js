const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 100;
const height = 600;
const legendX = width*.2;
const legendY = height*.5;
const numBreaks = 9;
const dontShow = [530330315021, 530330327063, 530330328003];

// Color scales for each variable
const colorScaleStops = d3.scaleLinear()
  .domain([10,75])
  .range(d3.schemePuBuGn[numBreaks]);
const colorScaleRoutes = d3.scaleLinear()
  .domain([1,2])
  .range(d3.schemePuBuGn[numBreaks]);
const colorScaleFreq = d3.scaleLinear()
  .domain([20,5])
  .range(d3.schemePuBuGn[numBreaks]);
const colorScaleAccess = d3.scaleLinear()
  .domain([50,100])
  .range(d3.schemePuBuGn[numBreaks]);

// Color function for a single block group (d) and choropleth properties (props)
function colorBlockGroups(d, props) {
  d.values = props.data.find(element=>element.GEOID==parseInt(d.properties.GEOID)) || -1;
  // Certain tracts don't have useful info, or don't have data
  if (dontShow.includes(d.values.GEOID) || d.values == -1) {
    return "#E8E8E8";
  }
  // Other tracts are more water than land
  if (d.properties.AWATER > d.properties.ALAND*1.5) {
    return "LightBlue";
  }
  // Remaining tracts get color according to the dataset/selected metric
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
}

// Function that returns the range dependent on which metric is selected
function getActiveRange(props) {
  switch (props.accessMetric) {
    case "num_stops":
      return d3.ticks(10,75,numBreaks)
    case "avg_num_routes_per_stop":
      return d3.ticks(1,2,numBreaks)
    case "avg_route_frequency":
      return d3.ticks(45,5,numBreaks)
    case "avg_accessible_stops":
      return d3.ticks(50,100,numBreaks)
  }
}

function getMetricName(props) {
  switch (props.accessMetric) {
    case "num_stops":
      return "Number of Stops"
    case "avg_num_routes_per_stop":
      return "Average Routes per Stop"
    case "avg_route_frequency":
      return "Average Route Frequency (mins)"
    case "avg_accessible_stops":
      return "Average Number of Accessible Stops"
  }
}

class D3Choropleth extends D3Component {
  initialize(node, props) {
    // The svg
    const svg = (this.svg = d3.select(node).append('svg')
      .style("width", width+'%')
      .style("height", height+'px')
      .style("border", '1px dashed #ccc')
    )

    // Hover functions
    function handleMouseOver(d, i) {
      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "black")
    }
    function handleMouseLeave(d, i) {
      d3.select(this)
        .style("opacity", .8)
        .style("stroke", "#808080")
    }

    // Map and projection
    const projection = d3.geoMercator()
      .scale(90000)
      .center([-122.60, 47.61])
      .translate([width / 2, height / 2])

    var g = svg.append("g");

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/cse412-21sp/transportation-accessibility/main/data/king_county_block_groups.geojson").then( function(data) {
        // Draw the map
          g.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", d3.geoPath()
              .projection(projection)
            )
            .attr("fill", function(d) {return colorBlockGroups(d, props)})
            .attr("class", function(d) {return "BlockGroup"})
            .style("stroke", "#808080")
            .on("mouseover", handleMouseOver)
            .on("mouseleave", handleMouseLeave)
    })
    var zoom = d3.zoom()
      .scaleExtent([1,1000000])
      .on('zoom', function(event) {
          g.selectAll('path')
           .attr('transform', event.transform);
      });
    svg.call(zoom);

    // The Legend range of bins
    var activeRange = getActiveRange(props);

    // Name of selected metric and background color
    svg
      .append("text")
      .attr("class","LegendTitle")
      .attr("x", legendX)
      .attr("y", legendY-5)
      .text(""+getMetricName(props))
      .style("background-color", "white")
      .style("fill", "black")
    svg
      .append('rect')
      .attr("class","LegendBackground")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", 100)
      .attr("height", activeRange.length * 20)
      .style("stroke","black")
      .style("fill","Ivory")

    // Individual bins+labels
    var legendEntries = svg.selectAll("g.LegendEntry")
      .data(activeRange)
      .enter()
    legendEntries
      .append("g")
      .attr("class","LegendEntry")
    // Rectangles with color of the bin
    legendEntries
      .append('rect')
      .attr("x", legendX + 10)
      .attr("y", function(d,i) {
        return legendY + 5 + (i*20);
      })
      .attr("class","binRect")
      .attr("width", 10)
      .attr("height", 10)
      .style("stroke", "black")
      .style("stroke-width", 0.5)
      .style("fill", function(d){return colorScaleStops(d)})
    // Text labels stating bin range
    legendEntries
      .append('text')
      .attr("x", legendX + 25)
      .attr("y", function(d,i) {
        return legendY + 5 + 10 + (i*20)
      })
      .attr("class","binText")
      .text(function(d,i) {
        if (i+1 != activeRange.length) {
          return ""+activeRange[i]+"-"+activeRange[i+1];
        }
        else {
          return ""+activeRange[i]+"+"
        }
      })
  }

  // Use this function to update the visualization.
  update(props, oldProps) {
    console.log(props);

    // Update map colors
    this.svg.selectAll('.BlockGroup')
      .attr("fill", function (d) {return colorBlockGroups(d, props)})

    //Update legend
    var activeRange = getActiveRange(props);
    this.svg.selectAll('.LegendTitle')
      .text(""+getMetricName(props))
    this.svg.selectAll('.binRect')
      .attr("fill", function (d, props) {
        switch (props.accessMetric) {
          case "num_stops":
            return colorScaleStops(d);
          case "avg_num_routes_per_stop":
            return colorScaleRoutes(d);
          case "avg_route_frequency":
            return colorScaleFreq(d);
          case "avg_accessible_stops":
            return colorScaleAccess(d);
        }
      })
    this.svg.selectAll('.binText')
      .text(function(d,i) {
        if (i+1 != activeRange.length) {
          return ""+activeRange[i]+"-"+activeRange[i+1];
        }
        else {
          return ""+activeRange[i]+"+"
        }
      })
  }
}

module.exports = D3Choropleth;