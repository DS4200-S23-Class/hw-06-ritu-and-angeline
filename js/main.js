/*
* Consulted https://d3-graph-gallery.com/graph/interactivity_brush.html for brushing with scatterplots (source is also noted in acknowledgements
*/

//Declare constants for frame
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

  //creates a scale for left visualization
const LEFT_VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const LEFT_VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

//create a new frame - scatterplot
const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "left"); 

//read data and create plot
d3.csv("data/iris.csv").then((data) => {


  //LEFT VISUALIZATION

   // find max X
  const MAX_X1 = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE1 = d3.scaleLinear() 
                    .domain([0, (MAX_X1 + 1)]) // add some padding  
                    .range([0, LEFT_VIS_WIDTH]); 

  // Add an x axis to the visualization  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.top + 
              "," + (LEFT_VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE1).ticks(10)) 
          .attr("font-size", '10px'); 

   // find max Y
  const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

  //Define scale functions that map our data values
  const Y_SCALE1 = d3.scaleLinear()
             .domain([0, (MAX_Y1 + 1)])
             .range([LEFT_VIS_HEIGHT, 0]);

   //Use X_SCALE1 and Y_SCALE1 to plot our points with appropriate x & y values
    let allPoints1 = FRAME1.append("g")
      .selectAll("points")
      .data(data) //passed from .then
      .enter()
      .append("circle")
      .attr("cx", (d) => { return (X_SCALE1(d.Sepal_Length) + MARGINS.left); })
      .attr("cy", (d) => { return (Y_SCALE1(d.Petal_Length) + MARGINS.top); })
      .attr("r", 4)
      .attr("class", (d) => {return d.Species});


    //Add a y-axis to the visualization
  FRAME1.append("g")
      .attr("transform", "translate(" + MARGINS.left + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
          .attr("font-size", '10px'); 

  //MIDDLE VISUALIZATION


  //creates a scale for middle visualization
const MID_VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const MID_VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

//create a new frame - scatterplot
const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "middle"); 


   // find max X
  const MAX_X2 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 

  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE2 = d3.scaleLinear() 
                    .domain([0, (MAX_X2 + 1)]) // add some padding  
                    .range([0, MID_VIS_WIDTH]); 

   // Add an x axis to the visualization  
  FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.top + 
              "," + (MID_VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE2).ticks(10)) 
          .attr("font-size", '10px'); 

   // find max Y
  const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

  //Define scale functions that map our data values
  const Y_SCALE2 = d3.scaleLinear()
             .domain([0, (MAX_Y2 + 1)])
             .range([MID_VIS_HEIGHT, 0]);

   //Use X_SCALE2 and Y_SCALE2 to plot our points with appropriate x & y values
  let allPoints2 = FRAME2.append("g")
      .selectAll("points")
      .data(data) //passed from .then
      .enter()
      .append("circle")
      .attr("cx", (d) => { return (X_SCALE2(d.Sepal_Width) + MARGINS.left); })
      .attr("cy", (d) => { return (Y_SCALE2(d.Petal_Width) + MARGINS.top); })
      .attr("r", 4)
      .attr("class", (d) => {return d.Species});

  //Add a y-axis to the visualization
  FRAME2.append("g")
      .attr("transform", "translate(" + MARGINS.left + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE2).ticks(10)) 
          .attr("font-size", '10px'); 

  //Brushing using d3.brush funtion
  FRAME2.call( d3.brush()                 
      .extent( [ [0,0], [FRAME_WIDTH, FRAME_HEIGHT] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    );

   // Function that is triggered when brushing is performed
  function updateChart(event) {
    extent = event.selection;
    allPoints1.classed("brush", function(d){ return isBrushed(extent, (X_SCALE2(d.Sepal_Width) + MARGINS.left), (Y_SCALE2(d.Petal_Width) + MARGINS.top) ) } );
    allPoints2.classed("brush", function(d){ return isBrushed(extent, (X_SCALE2(d.Sepal_Width) + MARGINS.left), (Y_SCALE2(d.Petal_Width) + MARGINS.top) ) } );
  }
  
  //Returns true or false if dot is in selection
  function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }


});

// RIGHT VISUALIZATION

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// add frame
const FRAME3 = d3.select("#vis3")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "right");


// define data
const data = [
  {species: 'setosa', count: 50},
  {species: 'virginica', count: 50},
  {species: 'versicolor', count:50}
  ];


// create a scale for x-axis
const X_SCALE3 = d3.scaleBand()
    .range([0, VIS_WIDTH])
    .domain(data.map((d) => { return d.species; }))
    .padding(0.5);


// find the maximum y-value
const MAX_Y3 = 50;

// Define scale functions that maps our data values 
// (domain) to pixel values (range)
const Y_SCALE3 = d3.scaleLinear()
            .domain([0, (MAX_Y3 + 1)])
            .range([VIS_HEIGHT, 0]);

// Use X_SCALE3 and Y_SCALE3 to plot our points with appropriate x & y values for the bar chart
FRAME3.selectAll("bars")
  .data(data) //passed from .then
  .enter()
  .append("rect")
    .attr("x", (d) => { return (X_SCALE3(d.species) + MARGINS.left); })
    .attr("y", (d) => { return (Y_SCALE3(d.count) + MARGINS.bottom); })
    .attr("width", X_SCALE3.bandwidth())
    .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE3(d.count); })
    .attr("class", "barChart")
    .attr("class", function(d, i) {return 'bar_' + d.species})
    .text("Count of Iris Species");

// Add x axis to vis
FRAME3.append("g") 
      .attr("transform", "translate(" + MARGINS.left + 
            "," + (VIS_HEIGHT + MARGINS.top) + ")") 
      .call(d3.axisBottom(X_SCALE3).ticks(7)) 
        .attr("font-size", '20px'); 

// Add y axis to vis
FRAME3.append("g") 
      .attr("transform", "translate(" + MARGINS.bottom + 
            "," + (MARGINS.top) + ")") 
      .call(d3.axisLeft(Y_SCALE3)) 
        .attr("font-size", '20px'); 
