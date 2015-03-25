
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
	var canvas = {svg:svg, margin:{top:40,bottom:5,left:30,right:120}};

	var xScale = d3.scale.ordinal()
	    		.domain(activeSkills)
	    		.rangeBands([canvas.margin.left,canvas.svg.attr("width")-canvas.margin.right]);

	var yScale = d3.scale.linear()
	    		.domain([1, 5.2])
	    		.range([canvas.svg.attr("height")-canvas.margin.bottom,canvas.margin.top]);

	generateAxesSlope(xScale,yScale,canvas,activeSkills.length);

	var lineFunc = d3.svg.line()
  		.x(function(d) {    return xScale(d.type)+xScale.rangeBand()/2; })
  		.y(function(d) {    return yScale(d.score); })
  		.interpolate('linear');

	filteredCSV_perturbed = perturbScores(filteredCSV,0.07);

	for (var i=0; i<filteredCSV_perturbed.length; i++){
		drawLine(filteredCSV_perturbed[i], lineFunc, canvas, i);	
	}

}


function perturbScores(filteredCSV, amplitude){

	var perturbed = [];
	for (var i=0; i<filteredCSV.length; i++){
		var skills_scores = filteredCSV[i].skills;
		var newScores = [];		
		for (var j=0; j<skills_scores.length; j++){

			newScores.push({type:skills_scores[j].type,score:parseInt(skills_scores[j].score)+perturb(amplitude)});
				
		}
		

		
		perturbed.push({visible:filteredCSV[i].visible,skills:newScores});		
	}
	return perturbed;
}

function perturb(amplitude){
	return Math.random()*amplitude;
}

function drawLine(filteredData, lineFunc, canvas, index){

  	canvas.svg.append("path")
		  .attr('d', lineFunc(filteredData.skills))
		  .attr('stroke', function(){ if (filteredData.visible){ return globalColorVector7_3[index];} else {return "#ddd"}}) 
		  .attr('class',  function(){ if (filteredData.visible){ return "foreground";} else {return "background"}}); 
}

function randColor(){
	return parseInt(Math.random()*256);
}

function randRGB(){

	var rgbstring = "rgb("+randColor()+","+randColor()+","+randColor()+")";
	return rgbstring;
}








