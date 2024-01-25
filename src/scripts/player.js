class Player {
	constructor(vals){
		if(vals===undefined){
			this.RNGSTAT = [Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1];
			this.trainStat = [0, 0, 0, 0];	
		}
		else{
			this.RNGSTAT = vals.slice(0, 4);
			this.trainStat = vals.slice(4, 8);
		}
		this.currentFloor = 0;
	}
	getRNGStat(){ return this.RNGSTAT; }
	getTrainStat(){ return this.trainStat; }
	setTrainStat(attribute){
		if(typeof(attribute) != Number || attribute < 0 || attribute >= 4){
			return;
		}
		else if(this.trainStat[attribute] >= TRAINMAX){
			logAndClear('Attribtue Cannot Increase');
			return;
		}

		this.trainStat[attribute]++;
		updateStats();
		return;
	}
	getFloorNumber(){ return this.currentFloor; }
	setFloorNumber(floorNum){ this.currentFloor = floorNum; }

}

let PLAYER = new Player();
const TRAINMAX = 10;

function updateStats(){
	CHANGE = 1;
	const STATS = document.getElementById('stats');
	
	if(PLAYER == null){
		STATS.innerHTML = "";
		return;
	}
	
	s = 'Health: ' + PLAYER.RNGSTAT[0] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[0] + `</a><br>` + 
	'Strength: ' + PLAYER.RNGSTAT[1] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[1] + `</a><br>` + 
	'Intelligence: ' + PLAYER.RNGSTAT[2] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[2] + `</a><br>` + 
	'Defense: ' + PLAYER.RNGSTAT[3] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[3] + `</a><br>`;
	
	STATS.innerHTML = s;
}

function fadeOut(element) {
	var opacity = 1;
	var interval = setInterval(function() {
		if (opacity > 0) {
			opacity -= 0.075;
			element.style.opacity = opacity;
		} 
		else {
			clearInterval(interval);
			element.innerHTML = "";
			element.style.opacity = 1;
		}
	}, 50);
}

async function logAndClear(errorMessage) {
	const errDiv = document.getElementById('error'); 
	if(errDiv.innerHTML == ""){
		errDiv.innerHTML = errorMessage;
		fadeOut(document.getElementById('error'));
	}
}

function handler(operation, param2){
	if(operation == 0){
		PLAYER.trainAttribute(param2);
		updateStats();
	}
}
