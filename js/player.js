let PLAYER = JSON.parse(localStorage.getItem('player')) ?? createNewPlayer();

function createNewPlayer(){
	return {
		baseStats: [Math.floor(Math.random()*5)+5, Math.floor(Math.random()*5)+5],
		trainStats: [0,0],
		currentFloor: 1,
		gold: 0,
		health: 10.0,
		mobKilled: [0,0,0,0,0]
	};
}

function savePlayer(){
	localStorage.setItem('player', JSON.stringify(PLAYER));
	return;
}

function updateStats(){
	if(PLAYER == null){
		document.getElementById('stats').style.display = 'none';
		return;
	}
	
	const LEVEL = document.getElementById('level');
	const GOLD =  document.getElementById('gold');
	const HEALTH =  document.getElementById('health');
	const STRENGTH =  document.getElementById('strength');
	const DEFENSE =  document.getElementById('defense');	

	LEVEL.innerHTML = `<b>Level:</b> ${PLAYER.currentFloor}&nbsp;<span style="font-weight:bold;color:goldenrod">-:-</span>&nbsp;`;
	GOLD.innerHTML = `<b>Gold:</b> ${PLAYER.gold}`;
	HEALTH.innerHTML = `<b>Health: </b>${(PLAYER.health).toFixed(2)}&nbsp;<span style="font-weight:bold;color:goldenrod">-:-</span>`;
	STRENGTH.innerHTML = `<b>Strength: </b>${PLAYER.trainStats[0]}&nbsp;<span style="font-weight:bold;color:goldenrod">-:-</span>`;
	DEFENSE.innerHTML = `<b>Defense: </b>${PLAYER.trainStats[1]}`;
		
	return;
}
