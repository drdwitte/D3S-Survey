	
function createHistogramMatrix(activeSkills, dataset, freqDistrSkills, metadata){


	//histogram Code
	var div = d3.select("#HistogramMatrixVisualization");
	

	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height")))
			;
	var canvas = {svg:svg, margin:{top:20,bottom:5,left:60,right:60}};

	//filter the frequency distribution for the active skills
	var filteredDistr = filterFreqDistribution(freqDistrSkills,activeSkills);
	
	//filterDictionary contains for each skill the cutoff value to filter individuals	
	var filterDictionary = initializeFilterDictionary(activeSkills);	

	//convert the input dataset to a format where the keys are explicitely in the value of the fields
	var convertedCSV = convertCSV(dataset,activeSkills, metadata);

	drawHistogramMatrix(filteredDistr, canvas, filterDictionary);

	
	
	//bind population
	createPopulationVisualization(convertedCSV);
	createStaticPopulationVisualization(convertedCSV);	
	//bind parallel coordinates
	createPCVisualization();
}

function initializeFilterDictionary(activeSkills){
	var filter = {};
	
	for (var i=0; i<activeSkills.length; i++){
		filter[activeSkills[i]]=0;
	}
	return filter;

}

function drawHistogramMatrix(data, canvas, filter){

	var numBoxes = data.length;
	var totalBoxWidth = canvas.svg.attr("width") - canvas.margin.left - canvas.margin.right;
	var singleBoxRange = totalBoxWidth / numBoxes;
	var singleBoxWidth = singleBoxRange*0.80;

	var left = canvas.margin.left;

	for (var i=0; i<numBoxes; i++)
	{	
		drawOneHistogram(data[i]["freqs"], data[i].name,left+i*singleBoxRange,left+i*singleBoxRange+singleBoxWidth, canvas, filter);
	}

	
}

function drawOneHistogram(data, dataName, xLeft, xRight, canvas, filter){

	var xScale = d3.scale.linear()
	    		.domain([0, d3.max(data)])
	    		.range([xLeft,xRight]);

	var yScale = d3.scale.ordinal()
	    		.domain([1,2,3,4,5])
	    		.rangeBands([canvas.svg.attr("height")-canvas.margin.bottom,canvas.margin.top]);

	var bars = canvas.svg.selectAll("bars")
	  		.data(data)
	  		.enter()
			.append("rect")
	    			.attr("width"  , function(d)  { return xScale(d)-xScale(0);})
				.attr("height" , function(d)  { return yScale.rangeBand()*0.95;})
				.attr("x"      , function(d)  { return xScale(0);})
				.attr("y"      , function(d,i){ return yScale(i+1);})
				.attr("class",dataName)
				.attr("id", function(d,i){return i+1;})
				.style("fill" ,  "green")
				.on("click",function(d,i){
					/*	
					De class voor de elementen wordt de dataName (staat hier enkele regels boven)
					en de id is de score die ze gegeven hebben (1-5). Je kan dan de geslecteerde id gebruiken
					als uiterste en alle bars met een id die minder is (of meer indien we willen) een andere
					style geven.
					*/
					var classname = "." + dataName;
					
					//When selecting d3.selectAll by classname, it returns an array object, with 1 array at index 0.
					// I am also setting 'clearing the previous selection' (if there was any) by giving all selected
					// elements back their red fill. You can read up on selections here: https://github.com/mbostock/d3/wiki/Selections
					var selectionObject = d3.selectAll(classname).attr("style","fill:green");
					var selection = selectionObject[0];

					for ( j=0; j<i; j++){
						selection[j].setAttribute("style","fill:red");
					}
					filter[dataName]=i;


					//createPCVisualization();
					
					updatePieCharts("filtered")
	
					
				})
			;

	var text = canvas.svg.selectAll("barlabels")
			.data(data)
			.enter()
			.append("text")
				.attr("x"      , function(d)  { return Math.max(xScale(0.5),xScale(d)-25);})
				.attr("y"      , function(d,i){ return yScale(i+1)+yScale.rangeBand()/2;})
				.text(function(d){ return d})
				.style("fill","white")
				;

	
	generateAxesHist(xScale,yScale,canvas,xLeft,dataName);


		
}

function generateAxesHist(xScale,yScale,canvas,xLeft,caption){

	//drawing the X and Y-axis + add a caption
	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top")
				.ticks(0)
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
					+canvas.margin.top
					+")"
		);
	gX.call(xAxis);

	var gY = canvas.svg.append("g");
	gY.attr("class","axis");
	gY.attr("transform","translate("
					+xLeft
					+","
					+0
					+")"
			);
	gY.call(yAxis);

	canvas.svg.append("text")
		.text(caption)
		.attr("transform","translate("
					+xLeft
					+","
					+canvas.margin.top/2
					+")"
		);

}





function convertCSV(csvObject, active, metadata){
	var converted = [];
	for (var i=0; i<csvObject.length; i++){
		converted.push(convertSingleRec(csvObject[i],active,metadata));	
	}
	return converted;
}

function convertSingleRec(record, active, metadata){

	var converted = {};

	for (var i=0; i<metadata.length; i++){
		converted[metadata[i]] = record[metadata[i]];
	}

	converted["visible"]=false;
	converted["skills"] =[];
	for (var i=0; i<active.length; i++){
		var sc = record[active[i]];
		converted["skills"].push({type:active[i], score:sc});	
	}
	return converted;
	
}



function filterFreqDistribution(elements,names){

	var filtered = [];

	for (var i=0; i<elements.length; i++){

		var index = names.indexOf(elements[i].name);		
		//console.log(elements[i].name + " -> " +  index);		
		if (index >=0)
			filtered[index] = elements[i];		
	} 
	return filtered;
}


