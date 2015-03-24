
function createBoxPlots(activeSkills, dataset){

	//boxplot Code
	var div = d3.select("#ForceScatter");

	//create svg
	div.selectAll("svg").remove();

	if (activeSkills.length < 2) return;
	


	var skillX = activeSkills[0];
	var skillY = activeSkills[1];

	
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height")))
			;
	var canvas = {svg:svg, margin:{top:140,bottom:140,left:60,right:30}};

	
	var xScale = d3.scale.linear()
	    		.domain([0,100])
	    		.range([canvas.margin.left, canvas.svg.attr("width")-canvas.margin.right]);

	var yScale = d3.scale.linear()
	    		.domain([0,100])
	    		.range([canvas.svg.attr("height")-canvas.margin.bottom,canvas.margin.top]);

	
	generateAxes(xScale,yScale,canvas,skillX,skillY);

	/*dataset = [
		{"from":1, "to:{} 		
	]*/

	var aggregatedData = [
				{x:0  , y:20  , w:30-1 , h:20-1,  diff:0, transition:"1->1"},
				{x:0  , y:70 ,  w:30-1 , h:50-1,  diff:1, transition:"1->2"},
				{x:0  , y:100 , w:30-1 , h:30-1,  diff:2, transition:"1->3"}, 

				{x:30 , y:10  , w:20-1 , h:10-1,  diff:1, transition:"2->1"},
				{x:30 , y:80 ,  w:20-1 , h:70-1,  diff:0, transition:"2->2"},	
				{x:30 , y:100 , w:20-1 , h:20-1,  diff:1, transition:"2->3"},

				{x:50 , y:50  , w:50-1 , h:50-1,  diff:2, transition:"3->1"},
				{x:50 , y:90 ,  w:50-1 , h:40-1,  diff:1, transition:"3->2"},
				{x:50 , y:100 , w:50-1 , h:10-1,  diff:0, transition:"3->3"}
				
			
				];
	//var colors = d3.scale.category10();
	var colors = [ "#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]

	// Add a group for each segment.
  	var squares = svg.selectAll(".squares")
      				.data(aggregatedData)
    				.enter().append("rect");


      	squares.attr("class", "squares")
		.attr("x", function(d)     { return xScale(d.x); })				
		.attr("y", function(d)     { return yScale(d.y)  })				      				
		.attr("width", function(d) { return xScale(d.w)-xScale(0)  })								
		.attr("height", function(d){ return yScale(0)-yScale(d.h)  })
		.style("fill", function(d) { return colors[9-d.diff];})				
		
		.on("mouseover", function(d){
			square = d3.select(this);
			svg.append("text")
				.attr("id","tooltipsquare")
				.text(d.transition)
				.attr("x",parseInt(square.attr("x")) +1 )
				.attr("y",parseInt(square.attr("y")) +20 )	
		})
		
		.on("mouseout", function(d){
			d3.select("#tooltipsquare").remove();
		})		
;


  // Add a rect for each market.
  /*var markets = segments.selectAll(".market")
      .data(function(d) { return d.values; })
    .enter().append("a")
      .attr("class", "market")
      .attr("xlink:title", function(d) { return d.market + " " + d.parent.key + ": " + n(d.value); })
    .append("rect")
      .attr("y", function(d) { return y(d.offset / d.parent.sum); })
      .attr("height", function(d) { return y(d.value / d.parent.sum); })
      .attr("width", function(d) { return x(d.parent.sum / sum); })
      .style("fill", function(d) { return z(d.market); });*/



}

function generateAxes(xScale,yScale,canvas, labelX, labelY){

	console.log("generate");
	//drawing the X and Y-axis + add a caption
	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
				.ticks(5)
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
					+(canvas.svg.attr("height")-canvas.margin.bottom)
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

	canvas.svg.append("text")
		.text(labelX)
		.attr("transform","translate("
					+(canvas.svg.attr("width")-5*canvas.margin.right)
					+","
					+(canvas.svg.attr("height")-canvas.margin.bottom+50)
					+")"
		);

	canvas.svg.append("text")
		.text(labelY)
		.attr("transform","translate("
					+(canvas.margin.left+10)
					+","
					+(canvas.margin.top-20)
					+")"
		);
}
