// Set the dimensions of the canvas / graph

var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;


// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
// var valueline = d3.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".center").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv", function(error, data) {
    if (error) throw error;

    // format the data (i.e., process it such that strings are converted to their appropriate types)
    data.forEach(function(d) {
        d.gdpPercap = +d.gdpPercap;
        d.lifeExp = +d.lifeExp;
        d.year = +d.year;
        d.pop = +d.pop;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    y.domain([29, d3.max(data, function(d) { return d.lifeExp; })]);

    // // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline);

    // filter the scatterplot to only have years 1952 and 2007
    // function checkDate(d) {
    //   return ((d.year === 1952) || (d.year === 2007));
    // }

    data = data.filter(d => ((d.year === 1952) || (d.year === 2007)))

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var x2 = d3.scaleLinear().range([4,10]);

    x2.domain([29, d3.max(data, function(d) { return d.pop; })]);
    // Add the scatterplot
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", function(d) { return x2(d.pop); })
        .attr("cx", function(d) { return x(d.gdpPercap); })
        .attr("cy", function(d) { return y(d.lifeExp); })
        .style("opacity", 0.8)
        .style("fill", function(d) {
            if (d.year === 1952) {
              return color("steelblue");
            } else {
              return color("orange");
            }
          });

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(11, ".0s"));

    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + 30) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("GDP per Capita");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.right - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Life Expectancy");


      svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top - 20))
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .style("font-weight", "bold")
          .text("GDP vs Life Expectancy (1952, 2007)");

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    var legend = svg.append("g")
      .attr("class", "legend")
      // .attr("x", width - 65)
      // .attr("y", 25)
      .attr("height", height)
      .attr("width", width);

    legend.append("rect")
      .attr("x", width - 50)
      .attr("y", 20)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", color("steelblue"));

      legend.append("text")
        .attr("x", width - 30)
        .attr("y", 30)
        .style("font-size", "11px")
        .text("1952");

      legend.append("rect")
        .attr("x", width - 50)
        .attr("y", 36)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", color("orange"));

      legend.append("text")
        .attr("x", width - 30)
        .attr("y", 46)
        .style("font-size", "11px")
        .text("2007");

});
