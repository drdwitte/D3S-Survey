
var color = d3.scale.category20b();

function createPopulationVisualization(convertedCSV, metadata){

	//population Code
	var div = d3.select("#PopulationVisualization");
	div.select("h1").remove();

	var title = "PV";
	div.append("h1").text("Filtered DS population")
		.attr("id",title);
	
	var captionHeight = document.getElementById(title).offsetHeight;
	console.log("cp "+captionHeight);
	
	/* create high scoped svgwidth and svgheight */


	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height"))-captionHeight)
			;
	var canvas = {svg:svg, margin:{top:5,bottom:5,left:5,right:5}};	


	//columns of interest: ID, Age, Gender, Degree, Experience
	
	var genderDistr = calculateDistribution(convertedCSV,"Gender");
	var ageDistr = calculateDistribution(convertedCSV,"Age");
	var degreeDistr =  calculateDistribution(convertedCSV,"Degree");
	//var experience =  calculateDistribution(convertedCSV,"Degree");
	
	var distributions = [genderDistr, ageDistr, degreeDistr];
	var names = ["Gender", "Age", "Highest degree"];

	drawPieCharts(distributions, canvas, names);

	
}

function createStaticPopulationVisualization(convertedCSV, metadata){

	//population Code
	var div = d3.select("#PopulationVisualizationStatic");
	div.select("h1").remove();

	var title = "PVStatic";
	div.append("h1").text("Full Data Science Summit population")
		.attr("id",title);
	
	var captionHeight = document.getElementById(title).offsetHeight;
	console.log("cp "+captionHeight);
	
	/* create high scoped svgwidth and svgheight */


	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height"))-captionHeight)
			;
	var canvas = {svg:svg, margin:{top:5,bottom:5,left:5,right:5}};	


	//columns of interest: ID, Age, Gender, Degree, Experience
	
	var genderDistr = calculateDistribution(convertedCSV,"Gender");
	var ageDistr = calculateDistribution(convertedCSV,"Age");
	var degreeDistr =  calculateDistribution(convertedCSV,"Degree");
	//var experience =  calculateDistribution(convertedCSV,"Degree");
	
	var distributions = [genderDistr, ageDistr, degreeDistr];
	var names = ["Gender", "Age", "Highest degree"];

	drawPieCharts(distributions, canvas, names);



}

function drawPieCharts(distributions, canvas, names){
	var boxHeight = canvas.svg.attr("height")/distributions.length;
	for (var i=0; i<distributions.length; i++){
		drawPieChart(distributions[i], canvas, i*boxHeight, boxHeight, names[i]);
	}
}

function calculateDistribution(csv,metaSkill){
	
	var distribution = {};
	
	for (var i=0; i<csv.length; i++){
		var type = csv[i][metaSkill];
		if(distribution[type]){
			distribution[type]++;
		} else {
			distribution[type]=1;
		}	
	}

	var keys = Object.keys(distribution);
	var differentFormat = [];	
	for (var i=0; i<keys.length; i++){
		differentFormat.push({name:keys[i], value:distribution[keys[i]]});
	}

	return differentFormat;
}

function drawPieChart(distr, canvas, yOffset, boxHeight, caption){


	var radius = boxHeight/2*0.75;
	var textX = 3*radius;
	var colors = d3.scale.category10();

	canvas.svg.append("text")
			.text(caption)
			.attr("x", textX)
			.attr("y", yOffset+radius - 25)
			.style("font-size", 25)
			.style("font-weight", "bold")	   
	/* append the group element, so you can position the graph */
	var group = canvas.svg.append("g")
				.attr("transform", function(){return "translate(90," + (radius+yOffset) + ")";});
	

	
	/* we should pass a width */

	console.log("this is the radius");
	console.log(radius);
	//console.log("this is the width");
	//console.log(canvas.svg.width);
	
	/* Het d objectje bij een arc is een object die beschrijft hoe het stukje pie eruit ziet. d in de functie
		heeft een data attribuut. In dat data attribuut zit dan de eigenlijk data, in dit geval een json 
		object. Vandaar: d.data.categorie; Bij die tip is dat ook zo
	*/
	
	/*var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([0, 0])
		.html(function(d) {
			return "<span style='color:black'>" + d.data.name + " : " +  d.data.value + "</span>";
	});	
	canvas.svg.call(tip);*/	

	var arc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(radius);
							
	var pie = d3.layout.pie()
				.value(function(d){
					console.log(d.value);
					return d.value;
				})
				.startAngle(0)
				.endAngle(2*Math.PI);
	
	
	var arcs = group.selectAll("g")
					.data(pie(distr))
					.enter()
					.append("g");

	
					
	arcs.append("path")
		.attr("d", arc)
		.attr("fill", function(d){return colors(d.data.value);})
		.attr("class","classpath")
		.on('mouseover', function(d){
					canvas.svg.append("text")
							.attr("x",textX)
							.attr("y",yOffset+radius)
							.text(d.data.name+" : "+d.data.value)
							.style("font-size", 15)
							.attr("id","tooltip");					
				})
		.on('mouseout', function(d){
					d3.select("#tooltip").remove();	


				 
				});
}
