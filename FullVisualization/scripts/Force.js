function calculateAllDistances(skillset,dataset){

	var distanceMatrix = {};

	//initialize matrix
	for (var i=0; i<skillset.length; i++){
		distanceMatrix[skillset[i]]={};
	}

	for (var i=0; i<skillset.length; i++){
		var si=skillset[i];
		for (var j=0; j<i; j++){
			var sj=skillset[j];
			//console.log(si+" "+sj);
			var dij = calculateSkillDistance(dataset,skillset[i],skillset[j]);
			distanceMatrix[si][sj] = dij;
			distanceMatrix[sj][si] = dij;
		}
	}
	return distanceMatrix;
}

function calculateSkillDistance(data, skilli, skillj){

	var dist = 0.0;
	var maxDist = Math.sqrt(data.length)*4;
	for (var i=0; i<data.length; i++){
		var scorei= data[i][skilli];
		var scorej= data[i][skillj];	
		dist+= Math.pow(scorei-scorej,2);
	}
	dist = Math.sqrt(dist) / maxDist;
	return dist;
}

function generateFrequencyDistribution(dataset, allSkills){

	var freqDistr = [];

	for (var j=0; j<allSkills.length; j++){	
		counts = [0,0,0,0,0];
		for (var i=0; i<dataset.length; i++){
			var score = dataset[i][allSkills[j]];
			counts[score-1]++;
					
		}
		freqDistr.push({ name:allSkills[j], freqs:counts });	

	}
	return freqDistr;
}

function calcRadius(d,i, linksPerNode, avgRadius){
 return -4*linksPerNode[i]+avgRadius+15;
}

function createForceVisualization(allSkills, data, metadata){

	//ordered array, showing which distances are currently clicked
	var selectedSkills = ["Algorithms","BackEnd","Bayesian","DistrData","Business"/*,"ClassicalStats","DataWrangling","FrontEnd","GraphModels","MachineLearning","Math","Optimization",
	"ProductDev","Science","Simulation","GIS","StructuredData","Marketing","SysAdmin","TimeSeries","UnstructuredData","Visualization"*/]; 

	var activeList = [];

	var div = d3.select("#ForceVisualization");

	//create svg
	div.selectAll("svg").remove();
	var svg = div.append("svg")		
			.attr("width",stripPX(div.style("width")))
			.attr("height",stripPX(div.style("height")))
			;
	var canvas = {svg:svg, margin:{top:5,bottom:5,left:5,right:5}};	

	var width = svg.attr("width");
	var height = svg.attr("height");
	var avgRadius = 20;

	//generate skill distances;
	//double map [skill1][skill2] -> euclidean distance * factor to map between 0 en 1 = 5*numPeople; 
	var skillDistances = calculateAllDistances(allSkills,data);

	var freqDistr = generateFrequencyDistribution(data, allSkills);

	//***
	//force Code
	//var cutoff = 15;
	
	
	var nodes = [];
	for (var i=0; i<allSkills.length; i++){
		nodes.push({name:allSkills[i], x:(0.5*width), y:(0.5*height)});	
	}


	var links = generateLinks(skillDistances, allSkills);


	var linksPerNode = calcLinksPerNode(links, nodes.length);



	var force = d3.layout.force()
    		.size([width, height])
    		.nodes(nodes)
    		.links(links)
	    	.on("tick", tick);

	force.linkDistance(function(links){ return links.dist; });
	force.linkStrength(function(link) { return 0.99; });
	force.charge(function(d){return -1000;})
	force.gravity(0.2);

	var link = svg.selectAll('.link')
	    .data(links)
	    .enter().append('line')
	    .attr('class', 'link');

	// Now it's the nodes turn. Each node is drawn as a circle.

	var node = svg.selectAll('.node')
	    .data(nodes)
	    .enter().append('circle')
	    .attr('class', 'node')
	    .style('fill', randRGB)
	    .attr('r', function(d,i){ return calcRadius(d,i,linksPerNode, avgRadius);})	
		;
	    
            

	var labels = svg.selectAll('.label')
	    .data(nodes)
	    .enter().append('text')
	    .attr('class', 'label');


	var nodesClicked = svg.append("text");
		nodesClicked.attr("x",width/5);
		nodesClicked.attr("y",height-10);
		nodesClicked.text("Nothing Clicked");
		

	var drag = force.drag()
	    .on("dragstart", dragstart);
	    
	//assigning a second class to a node
	node.classed('inactive',true);

force.on('end', function() {

    node.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
	.call(drag);

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });


    labels.attr('x',function(d) { return d.x+avgRadius-1; });
    labels.attr('y',function(d) { return d.y-avgRadius+1; });
    labels.text(function(d){ return d.name; })

	});

	force.start();
	//console.log(force.alpha());
	/*for (var i = 0; i < 5000; ++i){ force.tick(); //control the number of ticks (can also loop until force.alpha is acceptable value
		//console.log(force.alpha());
	}
	force.stop();	*/

	/*node.on("mouseover", function(d){
				

						var currentB = d3.select(this);
						var currentColor = currentB.style("fill");
						currentB.transition()
						.attr("backupColor",currentColor) 						
						.style("fill","blue");
						
				
					})

		.on("mouseout", function(d){
						
				
						var currentB = d3.select(this);
						var backupColor = currentB.attr("backupColor");
						currentB.transition()
							.style("fill" ,backupColor);
					})*/
				
		node.on("click", function(d){
						var currentB = d3.select(this);
						if (currentB.classed("inactive")){
							currentB.classed("inactive",false);
							currentB.classed("active",true);
							addToActiveList(d.name);
						} else {
							currentB.classed("active",false);
							currentB.classed("inactive",true);
							removeFromActiveList(d.name);					
						}

						nodesClicked.text(activeList);
						createHistogramMatrix(activeList,data, freqDistr, metadata);
						createBoxPlots(activeList, data);
					})
					;


	function addToActiveList(el){
		activeList.push(el);
	}

	function removeFromActiveListBackup(el){
		activeList.splice(activeList.indexOf(el));
	}

	function removeFromActiveList(el){
		var position = activeList.indexOf(el);
		//console.log("position " + position);
		if ( ~position ) activeList.splice(position, 1);
	}


	function dragstart(d) {
	  d3.select(this).classed("fixed", d.fixed = true);
	}

	function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });

	 labels.attr('x',function(d) { return d.x+avgRadius-1; });
	    labels.attr('y',function(d) { return d.y-avgRadius+1; });
	}

	//***


	//bind histogram matrix to click event
	createHistogramMatrix(selectedSkills,data, freqDistr,metadata);

}

function generateLinks(skillDist, skills){
	
	var links = [];
	for (var i=0; i<skills.length; i++){
		for (var j=0; j<i; j++){
			var dist = 50*skillDist[skills[i]][skills[j]];
			
			if (dist < 15){
			    links.push({ source: i, target: j, dist:12*dist });				
			}
		}
	}
	return links;

}

function calcLinksPerNode(links, numNodes){
	var numLinks = [];
	for (var i=0; i<numNodes; i++){
		numLinks.push(0);	
	}

	for (var i=0; i<links.length; i++){
		numLinks[links[i].source]++;
		numLinks[links[i].target]++;
	}

	return numLinks;
}

