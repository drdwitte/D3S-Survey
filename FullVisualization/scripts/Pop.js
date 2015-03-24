
var color = d3.scale.category20b();

function createPopulationVisualization(convertedCSV, metadata){

	filteredCSV = convertedCSV.slice(0, 0 + 100);

	var title = d3.select("#nonstaticpoptitle"); 
	var div = d3.select("#nonstaticcontainer"); 
	
	var titleHeight = title.style("height");	

	//create svg	
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height"))-stripPX(titleHeight))
			;
			
	var canvas = {svg:svg, margin:{top:5,bottom:5,left:5,right:5}};	


	//columns of interest: ID, Age, Gender, Degree, Experience
	
	var genderDistr = calculateDistribution(filteredCSV,"Gender");
	var ageDistr = calculateDistribution(filteredCSV,"Age");
	var degreeDistr =  calculateDistribution(filteredCSV,"Degree");
	var experienceDistr =  calculateDistributionExperience(filteredCSV,"Experience");
	
	var distributions = [genderDistr, ageDistr, degreeDistr, experienceDistr];
	var names = ["Gender", "Age", "Highest degree", "Experience"];
	
	console.log(ageDistr);

	drawPieCharts(distributions, canvas, names, "nonstatic");	
}

function createStaticPopulationVisualization(convertedCSV, metadata){
	var title = d3.select("#staticpoptitle"); 
	var div = d3.select("#staticcontainer"); 
	
	var titleHeight = title.style("height");
	console.log("titleHeight");

	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height"))-stripPX(titleHeight))
			;
			
	console.log("this is the svg static");
	console.log(svg);
	var canvas = {svg:svg, margin:{top:5,bottom:5,left:5,right:5}};	


	//columns of interest: ID, Age, Gender, Degree, Experience
	
	var genderDistr = calculateDistribution(convertedCSV,"Gender");
	var ageDistr = calculateDistribution(convertedCSV,"Age");
	var degreeDistr =  calculateDistribution(convertedCSV,"Degree");
	var experienceDistr =  calculateDistributionExperience(convertedCSV,"Experience");
	
	var distributions = [genderDistr, ageDistr, degreeDistr, experienceDistr];
	var names = ["Gender", "Age", "Highest degree", "Experience"];

	drawPieCharts(distributions, canvas, names, "static");



}

function drawPieCharts(distributions, canvas, names, type){
	var boxHeight = canvas.svg.attr("height")/distributions.length;
	
	console.log("boxheight non update " + canvas.svg.attr("height"));
	
	for (var i=0; i<distributions.length; i++){
		drawPieChart(distributions[i], canvas, i*boxHeight, boxHeight, names[i], type);
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

function calculateDistributionExperience(csv,metaSkill){
	
	var distribution = {
		"No":0, "Less than 3":0, "Less than 5":0,"Less than 10":0,"More than 10":0 
	};
	
	for (var i=0; i<csv.length; i++){
		var experience = csv[i][metaSkill];
		var type;
		if      (experience >= 10){ type="More than 10"; }
		else if (experience >= 5 ){ type="Less than 10"; }
		else if (experience >= 3 ){ type="Less than 5"; }
		else if (experience >= 1 ){ type="Less than 3"; }
		else if (experience == 0 ){ type="No"; }

		distribution[type]++;
			
	}

	var keys = Object.keys(distribution);
	var differentFormat = [];	
	for (var i=0; i<keys.length; i++){
		differentFormat.push({name:keys[i], value:distribution[keys[i]]});
	}

	return differentFormat;
}




function drawPieChart(distr, canvas, yOffset, boxHeight, caption, type){

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
				.attr("transform", function(){return "translate("+radius*1.5 +"," + (radius+yOffset) + ")";})
				.attr("id",caption + "-" +  type);
	
	/* Het d objectje bij een arc is een object die beschrijft hoe het stukje pie eruit ziet. d in de functie
		heeft een data attribuut. In dat data attribuut zit dan de eigenlijk data, in dit geval een json 
		object. Vandaar: d.data.categorie; Bij die tip is dat ook zo
	*/

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

function updatePieCharts(convertedCSV){
	var genderDistr = calculateDistribution(convertedCSV,"Gender");
	var ageDistr = calculateDistribution(convertedCSV,"Age");
	var degreeDistr =  calculateDistribution(convertedCSV,"Degree");
	var experienceDistr =  calculateDistributionExperience(convertedCSV,"Experience");
	
	var distributions = [genderDistr, ageDistr, degreeDistr, experienceDistr];
	var ids = ["Gender-nonstatic", "Age-nonstatic", "Highest degree-nonstatic", "Experience-nonstatic"];
	
	
	for( var i = 0; i<distributions.lenght; i++){
		var id = ids[i];
		var data = distributions[i];
		
		updatePieChart(id, data);
	}
}

function updatePieChart(id, data){
	var div = d3.select(".container");
	var height = div.selectAll("svg").attr("height");	
	
	var boxHeight = height/4; //4 is the length of the distributions array in previous function
	
	var radius = boxHeight/2*0.75;
	
	var arc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(radius);
	
	var pie = d3.layout.pie()
					.value(function(d){ return d.value;});

	d3.select(id).selectAll("path")			
			.data(pie(data))
			.transition().duration(2000)
			.attr("d",arc);
}
