class Player {
	constructor(jsonPlayer){
		if(jsonPlayer == null || jsonPlayer === undefined){
			this.RNGSTAT = [Math.floor(Math.random()*5)+5, Math.floor(Math.random()*5)+5];
			this.trainStat = [0, 0];	
			this.currentFloor = 1;
			this.gold = 0;
			this.health = 10.0;
			this.mobkilled = [0, 0, 0, 0, 0];
		}
		else{
			const jsonObject = JSON.parse(jsonPlayer);
			this.RNGSTAT = jsonObject.RNGSTAT;
			this.trainStat = jsonObject.trainStat;
			this.currentFloor = jsonObject.currentFloor;
			this.gold = jsonObject.gold;
			this.health = jsonObject.health;
			this.mobkilled = jsonObject.mobkilled;
		}
	}
	
	getRNGStat(){ return this.RNGSTAT; }
	getTrainStat(){ return this.trainStat; }
	setTrainStat(attribute){ this.trainStat[attribute]++; return;}
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
	
	LEVEL.innerHTML = "<b>Level:</b> " + getPlayer().currentFloor;
	GOLD.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Gold:</b> ' + getPlayer().gold;
	STRENGTH.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Strength: </b>' + getPlayer().trainStat[0];
	HEALTH.innerHTML = '<b>Health: </b>' + getPlayer().health.toFixed(2);
	DEFENSE.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Defense: </b>' + getPlayer().trainStat[1];

	return;
}

function debug(){
	console.log(getPlayer().RNGSTAT);
	console.log(getPlayer().trainStat);
	return;
}
