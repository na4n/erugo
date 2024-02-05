class Player {
	constructor(jsonPlayer){
		if(jsonPlayer == null || jsonPlayer === undefined){
			this.RNGSTAT = [Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1];
			this.trainStat = [10, 0, 0];	
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
let USER;

function savePlayer(){
	if(USER != null){
		localStorage.setItem('player', JSON.stringify(USER));
	}
	
	return;
}

function getPlayer(){
	if(USER == null){
		if(localStorage.getItem('player') == null){
			USER = new Player();
			savePlayer();
		}
		else{
			USER = new Player(localStorage.getItem('player'));
		}
	}
	
	return USER;
}

function updateStats(){
	const STATS = document.getElementById('stats');
	const LEVEL = document.getElementById('level');
	const GOLD =  document.getElementById('gold');
	const STRENGTH =  document.getElementById('strength');
	const HEALTH =  document.getElementById('health');
	const DEFENSE =  document.getElementById('defense');

	const p = getPlayer();

	if(p == null){
		STATS.innerHTML = "";
		return;
	}
	
	LEVEL.innerHTML = "<b>Level:</b> " + getPlayer().getFloorNumber();
	GOLD.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Gold:</b> ' + getPlayer().getGold();
	STRENGTH.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Strength: </b>' + getPlayer().getTrainStat()[1];
	HEALTH.innerHTML = '<b>Health: </b>' + getPlayer().getTrainStat()[0];
	DEFENSE.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Defense: </b>' + getPlayer().getTrainStat()[2];

	return;
}

function debug(){
	console.log(getPlayer().RNGSTAT);
	console.log(getPlayer().trainStat);
	return;
}
