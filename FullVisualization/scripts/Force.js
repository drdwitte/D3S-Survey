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
			var dij = calculateSkillDistance(dataset,skillset[i],skillset[j]);
			distanceMatrix[si][sj] = dij;
			distanceMatrix[sj][si] = dij;
		}
	}
	return distanceMatrix;
}

function calculateSkillDistance(data, skilli, skillj){

var dist = 0.0;

for (var i=0; i<data.length; i++){
	var scorei= data[i][skilli];
	var scorej= data[i][skillj];	
	dist+= Math.pow(scorei-scorej,2);
}

return Math.sqrt(dist);

}


function createForceVisualization(allSkills, skillDistances){

	var selectedSkills = []; //ordered array, showing which distances are currently clicked

	//force Code
	d3.select("#ForceVisualization").append("p").text("Force Visualization");

	
	

	//bind histogram matrix to click event
	createHistogramMatrix(selectedSkills);
}

