

function createPopulationVisualization(dataset){
	//population Code
	d3.select("#PopulationVisualization").selectAll("p").remove();
	d3.select("#PopulationVisualization").append("p").text("Population Visualization");
	
}

function createStaticPopulationVisualization(convertedCSV, metadata){
	//population Code
	var div = d3.select("#PopulationVisualizationStatic");
	div.append("p").text("test");

	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height")))
			;
	var canvas = {svg:svg, margin:{top:5,bottom:5,left:5,right:5}};	


	//columns of interest: ID, Age, Gender, Degree, Experience
	
	var genderDistr = calculateDistribution(convertedCSV,"Gender");
	var ageDistr = calculateDistribution(convertedCSV,"Age");
	var degreeDistr =  calculateDistribution(convertedCSV,"Degree");
	//var experience =  calculateDistribution(convertedCSV,"Degree");
	
	console.log(genderDistr);

	drawPieChart(genderDistr, canvas);
	//drawPieChart(ageDistr);
	//drawPieChart(degreeDistr);

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

function drawPieChart(distr, canvas){


	var colors = d3.scale.ordinal()
				   .range(["lightblue","pink"]);	
	/* append the group element, so you can position the graph */
	var group = canvas.svg.append("g")
				.attr("transform", "translate(90,90)");
			
	var radius = canvas.svg.width/3;
	
	/* Het d objectje bij een arc is een object die beschrijft hoe het stukje pie eruit ziet. d in de functie
		heeft een data attribuut. In dat data attribuut zit dan de eigenlijk data, in dit geval een json 
		object. Vandaar: d.data.categorie; Bij dien tip is da ook zo
	*/
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:red'>" + d.data.name + " : " + d.data.value + "</span>";
	});	
	canvas.svg.call(tip);	

	var arc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(radius);
							
	var pie = d3.layout.pie()
				.value(function(d){
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
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
}
