
function createHistogramMatrix(activeSkills){
	//histogram Code
	d3.select("#HistogramMatrixVisualization").append("p").text("HMatrix Visualization");
	
	//bind population
	createPopulationVisualization();	
	//bind parallel coordinates
	createPCVisualization();
}


