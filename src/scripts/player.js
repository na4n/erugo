class Player {
	constructor(jsonPlayer){
		if(jsonPlayer == null || jsonPlayer === undefined){
			this.RNGSTAT = [Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1];
			this.trainStat = [0, 0, 0, 0];	
			this.currentFloor = 1;
			this.gold = 0;
		}
		else{
			const jsonObject = JSON.parse(jsonPlayer);

			this.RNGSTAT = jsonObject.RNGSTAT;
			this.trainStat = jsonObject.trainStat;
			this.currentFloor = jsonObject.currentFloor;
			this.gold = jsonObject.gold;
		}
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
	increaseFloorNumber(){ this.currentFloor++; }
	getGold(){ return this.gold; }
	increaseGold(){ this.gold++; }
	
	playerString(){
		return "yay: " + this.getRNGStat() + this.getTrainStat() + this.getFloorNumber();
	}

}

const TRAINMAX = 10;
let PLAYER;

function savePlayer(){
	if(PLAYER != null){
		localStorage.setItem('player', JSON.stringify(PLAYER));
	}
	
	return;
}

function getPlayer(){
	if(PLAYER == null){
		PLAYER = new Player(localStorage.getItem('player'));
		savePlayer();
	}
	
	return PLAYER;
}

function updateStats(PLAYER){
	const STATS = document.getElementById('stats');
	const LEVEL = document.getElementById('level');
	
	if(PLAYER == null){
		STATS.innerHTML = "";
		return;
	}
	
	LEVEL.innerHTML = "Level: " + getPlayer().getFloorNumber();
	
	s = 'Gold: ' + PLAYER.getGold() + '<br><br>' + 
	'Health: ' + PLAYER.RNGSTAT[0] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[0] + `</a><br>` + 
	'Strength: ' + PLAYER.RNGSTAT[1] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[1] + `</a><br>` + 
	'Intelligence: ' + PLAYER.RNGSTAT[2] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[2] + `</a><br>` + 
	'Defense: ' + PLAYER.RNGSTAT[3] + '<a style="font-size: smaller; color:red;"> +' + PLAYER.trainStat[3] + `</a><br>`;
	
	STATS.innerHTML = s;
	
	
}

function handler(operation, param2){
	if(operation == 0){
		PLAYER.trainAttribute(param2);
		updateStats();
	}
}
