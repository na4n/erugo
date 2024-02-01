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
	setTrainStat(attribute){ this.trainStat[attribute]++;}
	getFloorNumber(){ return this.currentFloor; }
	increaseFloorNumber(){ this.currentFloor++; }
	getGold(){ return this.gold; }
	setGold(amt){this.gold=amt;}
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

function updateStats(){
	const STATS = document.getElementById('stats');
	const LEVEL = document.getElementById('level');
	
	const p = getPlayer();

	if(p == null){
		STATS.innerHTML = "";
		return;
	}
	
	LEVEL.innerHTML = "Level: " + getPlayer().getFloorNumber();
	
	s = 'Gold: ' + p.getGold() + '<br><br>' + 
	'Health: ' + getPlayer().getTrainStat()[0] + `<br>` + 
	'Strength: ' + getPlayer().getTrainStat()[1] + `<br>` + 
	'Intelligence: ' + getPlayer().getTrainStat()[2] + `<br>` + 
	'Defense: ' + getPlayer().getTrainStat()[3] + `<br>`;
	
	STATS.innerHTML = s;
}

function debug(){
	console.log(getPlayer().RNGSTAT);
	console.log(getPlayer().trainStat);
	return;
}
