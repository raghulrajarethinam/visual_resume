// Set the dimensions of the canvas / graph
var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define colorscale for step 4
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Define keys for legend
var keys=[{"col":true,"val":1952},{"col":false,"val":2007}];

// define scale for radius
var radScale=d3.scaleLinear();

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg object to the body of the page
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
    data= data.filter(function(d) {
        // d.date = parseTime(d.date);
        // d.close = +d.close;
        d.gdpPercap=parseFloat(d.gdpPercap);
        d.lifeExp=parseFloat(d.lifeExp);
        d.pop=parseInt(d.pop);
        if(d.year=="1952")
            d.colour=true;
        if(d.year=="2007")
            d.colour=false;
        return d.year=="1952" || d.year=="2007";
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    y.domain(d3.extent(data, function(d) { return d.lifeExp; }));

    // Scale the radius
    radScale.domain(d3.extent(data, function(d) { return d.pop; })).range([4,10]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .style("fill",function(d){return colorScale(d.colour);})
        .style("opacity", 0.8)
        .attr("r", function(d){ return radScale(d.pop);})
        .attr("cx", function(d) { return x(d.gdpPercap); })
        .attr("cy", function(d) { return y(d.lifeExp); });
        

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-family","Lato")
        .call(d3.axisBottom(x).tickArguments([11, ".0s"]));
        
    // text label for the x axis
    svg.append("text")             
    .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-family","sans-serif")
    .style("font-size","14px")
    .text("GDP Per Capita");

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", "700")
    .style("font-family","sans-serif")
    .style("font-size","14px")
    .text("Life Expectancy");

    //title for the chart
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top/2)+10)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline") 
        .style("font-weight", "bold")
        .style("font-family","sans-serif")
        .text("GDP vs Life Expectancy (1952, 2007)");

    //Add legend
    svg.selectAll("dots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", 700)
    .attr("y", function(d,i){ return 25 + i*(15)})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d){ return colorScale(d.col)})    
    
    svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 700 + 10*1.2)
    .attr("y", function(d,i){ return 25 + i*(15) + (9.5)})
    .text(function(d){ return d.val})
    .attr("text-anchor", "left")
    .style("font-size", "11px")
    .style("font-family","sans-serif")
    .style("alignment-baseline", "middle")
});
