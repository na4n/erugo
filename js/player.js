class Player {
	constructor(jsonObject) {
		this.RNGSTAT = jsonObject?.RNGSTAT ?? [Math.floor(Math.random() * 5) + 5, Math.floor(Math.random() * 5) + 5];
		this.trainStat = jsonObject?.trainStat ?? [0, 0];
		this.currentFloor = jsonObject?.currentFloor ?? 1;
		this.gold = jsonObject?.gold ?? 0;
		this.health = jsonObject?.health ?? 10.0;
		this.mobkilled = jsonObject?.mobkilled ?? [0, 0, 0, 0, 0];
	}
	  
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
		USER = new Player(JSON.parse(localStorage.getItem('player')));
		savePlayer();
	}

	return USER;
}

function updateStats(){
	if(getPlayer() == null){
		document.getElementById('stats').style.display = 'none';
		return;
	}
	
	const LEVEL = document.getElementById('level');
	const GOLD =  document.getElementById('gold');
	const STRENGTH =  document.getElementById('strength');
	const HEALTH =  document.getElementById('health');
	const DEFENSE =  document.getElementById('defense');	
	
	LEVEL.innerHTML = "<b>Level:</b> " + getPlayer().currentFloor;
	GOLD.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Gold:</b> ' + getPlayer().gold;
	STRENGTH.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Strength: </b>' + getPlayer().trainStat[0];
	HEALTH.innerHTML = '<b>Health: </b>' + getPlayer().health.toFixed(2);
	DEFENSE.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<b>Defense: </b>' + getPlayer().trainStat[1];

	return;
}
