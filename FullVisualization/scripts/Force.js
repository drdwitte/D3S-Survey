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

	


	var mockup = [
					{"name":"Algorithms","freqs":[55,60,59,50,17]},
					{"name":"BackEnd","freqs":[85,67,35,36,18]},
					{"name":"Bayesian","freqs":[88,74,84,24,7]},
					{"name":"DistributedData","freqs":[56,87,61,26,11]},
					{"name":"Business","freqs":[38,54,43,73,33]},
					{"name":"ClassicalStats","freqs":[33,51,70,58,29]},
					{"name":"DataWrangling","freqs":[34,45,53,70,39]},
					{"name":"FrontEnd","freqs":[67,72,50,40,12]},
					{"name":"GraphModels","freqs":[81,73,46,29,12]},
					{"name":"MachineLearning","freqs":[51,71,42,53,24]},
					{"name":"Math","freqs":[30,45,77,56,33]},
					{"name":"Optimization","freqs":[54,72,66,38,11]},
					{"name":"ProductDev","freqs":[50,48,57,55,31]},
					{"name":"Science","freqs":[60,51,47,46,37]},
					{"name":"Simulation","freqs":[96,67,55,20,8]},
					{"name":"GIS","freqs":[123,70,25,18,5]},
					{"name":"StructuredData" ,"freqs":[40,39,53,66,43]},
					{"name":"Marketing","freqs":[74,81,50,25,11]},
					{"name":"SysAdmin","freqs":[101,54,43,32,11]},
					{"name":"TimeSeries","freqs":[61,65,67,34,14]},
					{"name":"UnstructuredData","freqs":[69,61,53,41,17]},
					{"name":"Visualization","freqs":[42,63,63,48,25]}
				];

	return mockup;
}






function createForceVisualization(allSkills, data){

	//ordered array, showing which distances are currently clicked
	var selectedSkills = ["Algorithms","BackEnd","Bayesian","DistributedData","Business","ClassicalStats","DataWrangling","FrontEnd","GraphModels","MachineLearning","Math","Optimization",
	"ProductDev","Science","Simulation","GIS","StructuredData","Marketing","SysAdmin","TimeSeries","UnstructuredData","Visualization"]; 



	d3.select("#ForceVisualization").append("p").text("Force Visualization");

	//generate skill distances;
	//double map [skill1][skill2] -> euclidean distance * factor to map between 0 en 1 = 5*numPeople; 
	var skillDistances = calculateAllDistances(allSkills,data);
	//console.log(skillDistances);

	var freqDistr = generateFrequencyDistribution(data, allSkills);

	//***
	//force Code
	//***


	//bind histogram matrix to click event
	createHistogramMatrix(selectedSkills,data, freqDistr);

}

