
function generateAxesSlope(xScale, yScale, canvas, numSkills){
  //drawing the X and Y-axis + add a caption
  var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top")
				.ticks(numSkills)
					;

  var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(5)
				;



  var gX = canvas.svg.append("g");
  gX.attr("class","axis");
  gX.attr("transform","translate("
					+0
					+","
					+(canvas.margin.top)
					+")"
		);
  gX.call(xAxis);

	

  var gY = canvas.svg.append("g");
  gY.attr("class","axis");
  gY.attr("transform","translate("
					+canvas.margin.left
					+","
					+0
					+")"
			);
  gY.call(yAxis);
}
//globalColorVector7_3

function createPCVisualization(activeSkills, filteredCSV){
	//parallel coordinates Code
	var div = d3.select("#PCVisualization");

	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height")))
			;
	var canvas = {svg:svg, margin:{top:20,bottom:5,left:30,right:5}};

	var xScale = d3.scale.ordinal()
	    		.domain(activeSkills)
	    		.rangeBands([canvas.margin.left,canvas.svg.attr("width")-canvas.margin.bottom]);

	var yScale = d3.scale.linear()
	    		.domain([1, 5.2])
	    		.range([canvas.svg.attr("height")-canvas.margin.bottom,canvas.margin.top]);

	generateAxesSlope(xScale,yScale,canvas,activeSkills.length);

	var lineFunc = d3.svg.line()
  		.x(function(d) {    return xScale(d.type)+xScale.rangeBand()/2; })
  		.y(function(d) {    return yScale(d.score); })
  		.interpolate('linear');

	for (var i=0; i<filteredCSV.length; i++){
		drawLine(filteredCSV[i], lineFunc, canvas);	
	}

}




function drawLine(filteredData, lineFunc, canvas){

  	canvas.svg.append("path")
		  .attr('d', lineFunc(filteredData.skills))
		  .attr('stroke', function(data){ if (filteredData.visible){ return randRGB();} else {return "#ddd"}}) 
		  .attr('class',  function(data){ if (filteredData.visible){ return "foreground";} else {return "background"}}); 
}

function randColor(){
	return parseInt(Math.random()*256);
}

function randRGB(){

	var rgbstring = "rgb("+randColor()+","+randColor()+","+randColor()+")";
	return rgbstring;
}








