
var color = d3.scale.category20b();
var populationCanvas;	
var pieRadius;

var genders;
var ages;
var degrees;
var experiences;

function createPopulationVisualization(convertedCSV){

	var filteredCSV = removeInvisibles(convertedCSV);
	//filteredCSV = convertedCSV;

	var title = d3.select("#nonstaticpoptitle"); 
	var div = d3.select("#nonstaticcontainer"); 
	
	//var titleHeight = title.style("height");	

	//create svg	
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height"))/*-stripPX(titleHeight)*/)
			;
	
		svg.append("text")
		.attr("x",svg.attr("width")/5)
		.attr("y",svg.attr("height"))
		.text("TOT: "+filteredCSV.length)
		.style("font-size",12);
		
	var canvas = {svg:svg, margin:{top:45,bottom:0,left:5,right:5}};	
	populationCanvas=canvas

	//columns of interest: ID, Age, Gender, Degree, Experience
	
	var genderDistr = calculateDistribution(filteredCSV,"Gender",genders);
	var ageDistr = calculateDistribution(filteredCSV,"Age",ages);
	var degreeDistr =  calculateDistribution(filteredCSV,"Degree",degrees);
	var experienceDistr =  calculateDistributionExperience(filteredCSV,"Experience");
	
	var distributions = [genderDistr, ageDistr, degreeDistr, experienceDistr];
	var names = ["Gender", "Age", "Highest degree", "Experience"];
	


	drawPieCharts(distributions, canvas, names, "nonstatic", true);	
}

function createStaticPopulationVisualization(convertedCSV){
	var title = d3.select("#staticpoptitle"); 
	var div = d3.select("#staticcontainer"); 
	
	//var titleHeight = title.style("height");


	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height"))/*-stripPX(titleHeight)*/)
			;
			
	svg.append("text")
		.attr("x",svg.attr("width")/5)
		.attr("y",svg.attr("height"))
		.text("TOT: "+convertedCSV.length)
		.style("font-size",12);
	

	var canvas = {svg:svg, margin:{top:45,bottom:0,left:5,right:5}};	


	//columns of interest: ID, Age, Gender, Degree, Experience
	
	genders     = extractKeys("Gender", convertedCSV);
	ages        = extractKeys("Age"   , convertedCSV);
	degrees     = extractKeys("Degree", convertedCSV);
        var experiences  = ["No", "<3", "<5","<10","10+"]; 
	


	var genderDistr = calculateDistribution(convertedCSV,"Gender",genders);
	var ageDistr = calculateDistribution(convertedCSV,"Age",ages);
	var degreeDistr =  calculateDistribution(convertedCSV,"Degree",degrees);
	var experienceDistr =  calculateDistributionExperience(convertedCSV,"Experience");
	
	var distributions = [genderDistr, ageDistr, degreeDistr, experienceDistr];
	var names = ["Gender", "Age", "Highest degree", "Experience"];

	drawPieCharts(distributions, canvas, names, "static", false);



}

function drawPieCharts(distributions, canvas, names, type, showCaption){
	var boxHeight = (canvas.svg.attr("height")-canvas.margin.top-canvas.margin.bottom)/distributions.length;
	

	
	for (var i=0; i<distributions.length; i++){
		drawPieChart(distributions[i], canvas, canvas.margin.top+i*boxHeight, boxHeight, names[i], type, showCaption);
	}
}


function extractKeys(metaSkill, csv){
	var distr = {};
	
	for (var i=0; i<csv.length; i++){
		var type = csv[i][metaSkill];
		if(distr[type]){
			
		} else {
			distr[type]=1;
		}	
	}

	return Object.keys(distr).sort();

}
function calculateDistribution(csv,metaSkill, possibles){
	
	var distribution = {};
	
	for (var i=0; i<possibles.length; i++){
		distribution[possibles[i]]=0;	
	}	
	

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
		"No":0, "<3":0, "<5":0,"<10":0,"10+":0 
	};
	
	for (var i=0; i<csv.length; i++){
		var experience = csv[i][metaSkill];
		var type;
		if      (experience >= 10){ type="10+"; }
		else if (experience >= 5 ){ type="<10"; }
		else if (experience >= 3 ){ type="<5"; }
		else if (experience >= 1 ){ type="<3"; }
		else if (experience == 0 ){ type="No"; }
		if (type)
			distribution[type]++;
			
	}

	var keys = Object.keys(distribution);
	var differentFormat = [];	
	for (var i=0; i<keys.length; i++){
		differentFormat.push({name:keys[i], value:distribution[keys[i]]});
	}

	return differentFormat;
}




function drawPieChart(distr, canvas, yOffset, boxHeight, caption, type, showCaption){

	var radius = boxHeight/2*0.85;
	pieRadius = radius;
	var textX = 2.7*radius;
	//var colors = d3.scale.category10();
	var colors = [ "#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]
	
	if (showCaption){
		canvas.svg.append("text")
				.text(caption)
				.attr("x", textX)
				.attr("y", yOffset+radius - 25)
				.style("font-size", 15)
				.style("font-weight", "bold")
	}	   
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
		.attr("fill", function(d){return colors[getIndexInDistr(distr,d.data.name)];})
		.attr("class","classpath")
		.style("fill-opacity",0.7)
		.on('mouseover', function(d){
					canvas.svg.append("text")
							.attr("x",textX)
							.attr("y",yOffset+radius)
							.text(d.data.name+": "+d.data.value)
							.style("font-size", 15)
							.attr("id","tooltip");					
				})
		.on('mouseout', function(d){
					d3.select("#tooltip").remove();	


				 
				});
}

function getIndexInDistr(distr, name){

	

	for (var i=0; i<distr.length; i++){
		if (distr[i].name == name)
		{
			//console.log(name + " "+ i);
			return i;
		}	
	}

}

function removeInvisibles(convertedCSV){
	var filteredCSV = [];

	for (var i=0; i<convertedCSV.length; i++){
		if (convertedCSV[i].visible){
			filteredCSV.push(convertedCSV[i]);		
		}	
	}

	return filteredCSV;


}

function updatePieCharts(convertedCSV){

	var filteredCSV = removeInvisibles(convertedCSV);

	console.log(convertedCSV.length+" versus "+filteredCSV.length);

	var genderDistr = calculateDistribution(filteredCSV,"Gender");
	var ageDistr = calculateDistribution(filteredCSV,"Age");
	var degreeDistr =  calculateDistribution(filteredCSV,"Degree");
	var experienceDistr =  calculateDistributionExperience(filteredCSV,"Experience");
	
	var distributions = [genderDistr, ageDistr, degreeDistr, experienceDistr];
	var ids = ["Gender-nonstatic", "Age-nonstatic", "Highest degree-nonstatic", "Experience-nonstatic"];
	
	
	for( var i = 0; i<distributions.length; i++){

		var id = ids[i];
		var data = distributions[i];
		
		updatePieChart(id, data);
	}

}

function updatePieChart(id, data){
	var div = d3.select(".container");
	var height = populationCanvas.svg.attr("height");
	var numVis = 4;
	var boxHeight = (populationCanvas.svg.attr("height")-populationCanvas.margin.top-populationCanvas.margin.bottom)/numVis;

	
	var radius = pieRadius;

	
	var arc = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(radius);
	
	var pie = d3.layout.pie()
					.value(function(d){ return d.value;});

	/*console.log(id);
	console.log(d3.select("#"+id).selectAll("path"));*/	


	//console.log(populationCanvas.svg.selectAll("g#"+id).selectAll("path").length);

	populationCanvas.svg.selectAll("g#"+id).selectAll("path")
	//d3.select(id).selectAll("path")			
			.data(pie(data))
			.transition().duration(200)
			.attr("d",arc);
}
