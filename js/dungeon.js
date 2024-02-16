let LOCATIONS; //0: PLAYER, 1: TRAINER, 2: STAIRS
let FLOORDIMENSION;

let CHARHEIGHT;
let CHARWIDTH;

const MOBTYPES = ['%', '>', '~', '^', '&'];
const PLAYER = '@';
const STAIRS = '\\';
const TRAINER = '+';
const GOLD = '*';
const HEALTHPOTION = 'o';

async function dungeonMessage(msg, col, up){
	let loc = structuredClone(LOCATIONS[0].loc);
	while(getEntityAtLocation(loc) !== null){
		up ? loc[0]-- : loc[0]++;
	}

	const entityLayerDiv = document.getElementById('entity-layer');
	if(document.getElementById('dmg') !== null){
		document.getElementById('dmg').remove();
	}

	const div = document.createElement('div');
	let divId;
	for (i = 65; i <= 90; i++) {
		if(document.getElementById(String.fromCharCode(i)) == null){
			divId = String.fromCharCode(i);
		}
	}
	
	div.id = divId;
	div.innerHTML = `<b>${msg}</b>`;
	Object.assign(div.style, {
		opacity: '1',
		color: col,
		float: 'left',
		position: 'absolute',
		left: `${CHARWIDTH * (1 + loc[1])}px`,
		top: `${CHARHEIGHT * (1 + loc[0])}px`,
		backgroundColor: document.body.style.backgroundColor
	});

	entityLayerDiv.appendChild(div);		
	fade(div, 'rm');
	return;
}

function mobAttack(){
	const playerLocation = LOCATIONS[0].loc;
	let playerDamage = 0;
	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch) && totalDistance(LOCATIONS[i].loc, playerLocation) <= 1.42){
			if(LOCATIONS[i].ch == '%'){ 
				playerDamage += (1 + Math.round(Math.random())); 
			}
			else if(LOCATIONS[i].ch == '>'){ 
				playerDamage += (2 + Math.round(Math.random())); 
			}
			else if(LOCATIONS[i].ch == '~'){ 
				playerDamage += (3 + Math.round(Math.random())); 
			}
			else if(LOCATIONS[i].ch == '^'){ 
				playerDamage += (4 + Math.round(Math.random()));
			}
			else if(LOCATIONS[i].ch == '&'){ 
				playerDamage += (5 + Math.round(Math.random())); 
			}	
		}
	}

	playerDamage /= (getPlayer().RNGSTAT[1] + getPlayer().trainStat[1])/5;
	if(playerDamage > 0){	
		getPlayer().health -= playerDamage; 

		if(getPlayer().health <= 0){
			getPlayer().health = 0;
			gameOver = -1;
			localStorage.setItem('gameOver', gameOver);
			savePlayer();
			displayGameOver(gameOver);
		}
		else{
			dungeonMessage('-'+playerDamage.toFixed(2), 'red', true);
		}
		updateStats();  
		return getPlayer().health <= 0;
	}

	return false;
}

function totalDistance(loc1, loc2) { return Math.hypot(loc1[0] - loc2[0], loc1[1] - loc2[1]); }	

function moveEntities(){	
	const withinBounds = (c) => c[0] >= 0 && c[0] < FLOORDIMENSION[0] && c[1] >= 0 && c[1] < FLOORDIMENSION[1];
	
	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch)){			
			let targetLoc;
			
			const playerLoc = LOCATIONS[0].loc;
			const trainerLoc = LOCATIONS[1].loc;
			const stairsLoc = LOCATIONS[2].loc;
			
			if(totalDistance(playerLoc, LOCATIONS[i].loc) <= 5){
				targetLoc = playerLoc;
			}
			else{
				const arrLocs = [playerLoc, trainerLoc];
				getEntityAtLocation(stairsLoc) === STAIRS && arrLocs.push(stairsLoc);
				arrLocs.sort((a, b) => totalDistance(LOCATIONS[i].loc, a) - totalDistance(LOCATIONS[i].loc, b));
				targetLoc = arrLocs[0];
			}

			if(totalDistance(LOCATIONS[i].loc, targetLoc) <= 1){ 
				continue; 
			}

			const moveDistances = [[LOCATIONS[i].loc[0]+1, LOCATIONS[i].loc[1]], [LOCATIONS[i].loc[0]-1, LOCATIONS[i].loc[1]], [LOCATIONS[i].loc[0], LOCATIONS[i].loc[1]+1], [LOCATIONS[i].loc[0], LOCATIONS[i].loc[1]-1]];
			moveDistances.sort((a, b) => totalDistance(targetLoc, a) - totalDistance(targetLoc, b));
			let j = 0;
			while(j < 4){
				if(withinBounds(moveDistances[j]) && (getEntityAtLocation(moveDistances[j])===null || getEntityAtLocation(moveDistances[j] == GOLD))){
					const div = document.getElementById(i);
					div.style.left = CHARWIDTH * (moveDistances[j][1]+1) + 'px';
					div.style.top = CHARHEIGHT * (moveDistances[j][0]+1) + 'px';
					LOCATIONS[i].loc = moveDistances[j];
					
					break;
				}
				j++;
			}
	 	}
	}
	return;
}

function entitiesRefresh(){
	document.getElementById('entity-layer').innerHTML = '';
	for(let i=0; i < LOCATIONS.length; i++){
		const div = `<div id="${i}"style=float:left;position:absolute;left:${CHARWIDTH * (1+LOCATIONS[i].loc[1])}px;top:${CHARHEIGHT * (1+LOCATIONS[i].loc[0])}px;>${LOCATIONS[i].ch}</div>`
		const entityLayerDiv = document.getElementById('entity-layer');
		const a = document.getElementById(i);
		if(a !== null){
			a.remove();
		}
		entityLayerDiv.insertAdjacentHTML('beforeend', div);
	}

	return true;
}

function getEntityAtLocation(loc){
	for(let i = 0; i < LOCATIONS.length; i++){
		if(LOCATIONS[i].loc[0] == loc[0] && LOCATIONS[i].loc[1] == loc[1]){
			return LOCATIONS[i].ch;
		}
	}
	
	return null;
}


function removeEntityDiv(id){
	const rdiv = document.getElementById(id);
	rdiv.remove();
	for(let i = id+1; i < LOCATIONS.length; i++){
		const currDiv = document.getElementById(i);
		currDiv.setAttribute('id', i-1);
	}
}

function moveCharacter(keyPress){
	function validLocation(loc){ 
		return 0 <= loc[0] && loc[0] < FLOORDIMENSION[0] && 0 <= loc[1] && loc[1] < FLOORDIMENSION[1];  
	}

	function locationIndex(location, char){
		for(let i = 0; i < LOCATIONS.length; i++){
			if(LOCATIONS[i].loc[0] == location[0] && LOCATIONS[i].loc[1] == location[1]){
				if(LOCATIONS[i].ch == char){
					return i;
				}
			}
		}
	
		return null;
	}

	const playerLocation = LOCATIONS[0].loc;
	
	let nextLocation;
	if(keyPress == 'ArrowUp'){ 
		nextLocation = [playerLocation[0]-1, playerLocation[1]]; 
	}
	else if(keyPress == 'ArrowDown'){ 
		nextLocation = [playerLocation[0]+1, playerLocation[1]]; 
	}
	else if(keyPress == 'ArrowLeft'){ 
		nextLocation = [playerLocation[0], playerLocation[1]-1]; 
	}
	else if(keyPress == 'ArrowRight'){ 
		nextLocation = [playerLocation[0], playerLocation[1]+1]; 
	}
	else{ 
		return false; 
	}

	if(validLocation(nextLocation) && [GOLD, HEALTHPOTION, STAIRS, null].includes(getEntityAtLocation(nextLocation))){
		if(locationIndex(nextLocation, STAIRS) != null){
			enterStairs();
			return false;
		}
		else if(locationIndex(nextLocation, GOLD) != null){
			getPlayer().gold += 1;
			dungeonMessage('+1', 'goldenrod', true);
			let i = locationIndex(nextLocation, GOLD)
			removeEntityDiv(i);
			LOCATIONS.splice(i, 1);
			updateStats();
		}
		else if(locationIndex(nextLocation, HEALTHPOTION) != null){
			const currentHealth = getPlayer().health;
			getPlayer().health = (currentHealth + 1) >= 10 ? 10 : currentHealth + 1;
			dungeonMessage('+1', 'deeppink', true);
			let i = locationIndex(nextLocation, HEALTHPOTION)
			removeEntityDiv(i);
			LOCATIONS.splice(i, 1);
			updateStats();
		}

		const char = document.getElementById('0');
		char.style.left = CHARWIDTH * (nextLocation[1]+1) + 'px';
		char.style.top = CHARHEIGHT * (nextLocation[0]+1) + 'px';
		LOCATIONS[0].loc = nextLocation;

		return true;
	}

	logMsg('Cannot move there', FADE);
	return false;
}

function enterStairs(){
	const stairsLoc = getEntityAtLocation(LOCATIONS[2].loc) !== STAIRS ? LOCATIONS[1].loc : LOCATIONS[2].loc;
	const charLoc =  LOCATIONS[0].loc;
	
	if(oneSpaceAway(stairsLoc, charLoc) > 1){
		logMsg('You are too far from the stairs', FADE);
		return false;
	}
	else if(getPlayer().currentFloor >= 10){
		gameOver = 1;
		localStorage.setItem('gameOver', 1);
		displayGameOver(1);
		return false;
	}
	else{
		getPlayer().currentFloor++;
		updateStats();
		localStorage.removeItem('fd');
		localStorage.removeItem('loc');
		dungeonRefresh(getPlayer().currentFloor);
		updateStats();
		save();
		return true;
	}
}

function train(key){
	if(getEntityAtLocation(LOCATIONS[1].loc) !== TRAINER){
		logMsg('No trainer, stay weak kid', FADE);
		return false;
	}
	if(oneSpaceAway(LOCATIONS[0].loc, LOCATIONS[1].loc) > 1){
		logMsg("You are too far from the trainer", FADE);
		return false;
	}

	if(key == 's' || key == 'd'){
		if(getPlayer().gold < 5){
			logMsg('Not enough gold, need 5 to train', FADE);
			return false;
		}
		else{
			key == 's' ? getPlayer().trainStat[0]++ : getPlayer().trainStat[1]++;
			getPlayer().gold -= 5;
			key == 's' ? logMsg('Trained Strength', FADE) : logMsg('Trained Defense', FADE);
			updateStats();
			return true;
		}
	}
	else{
		const numInput = Number(key);
		if(getPlayer().gold < numInput){
			logMsg(`Not enough gold, need ${numInput} to gain ${numInput} health`, FADE);
			return false;
		}
		else{
			getPlayer().gold -= numInput;
			getPlayer().health = getPlayer().health + numInput > 10 ? 10 : getPlayer().health + numInput;
			logMsg(`Gained ${numInput} health`, FADE);
			updateStats();
		}

	}
}
const oneSpaceAway = function(loc1, loc2){ 
	return Math.abs(loc1[0]-loc2[0])+Math.abs(loc1[1]-loc2[1]); 
};

function attack(){	
	const charLoc = LOCATIONS[0].loc;
	for(let i = 0; i < LOCATIONS.length; i++){
		if(totalDistance(charLoc, LOCATIONS[i].loc) <= 1.42 && MOBTYPES.includes(LOCATIONS[i].ch)){
			let dmg = Math.floor(((getPlayer().RNGSTAT[0] + getPlayer().trainStat[0])) / 5);
			const attackDamage = dmg == 0 ? 1 + (Math.round(Math.random() * 20) / 20) : (dmg + (Math.round(Math.random() * 20) / 20));
			LOCATIONS[i].health -= attackDamage;
			if(LOCATIONS[i].health <= 0){
				logMsg('You killed ' + LOCATIONS[i].ch, FADE);
				getPlayer().mobkilled[MOBTYPES.indexOf(LOCATIONS[i].ch)]++;
				removeEntityDiv(i);
				LOCATIONS.splice(i, 1);
			}
			dungeonMessage('-' + attackDamage.toFixed(2), 'green', false);
			return true;
		}
	}

	logMsg('You attacked air', FADE);
	return false;
}

function keyHandler(keyPress){
	async function lockMoveWait(){
		function blockInput(event){
			event.preventDefault();
		}
		document.removeEventListener('keydown', divKeyDownHandler)
		document.addEventListener('keydown', blockInput);
		await delay(25);
		moveEntities();
		document.removeEventListener('keydown', blockInput);
		document.addEventListener('keydown', divKeyDownHandler);
	}

	if(gameOver){ 
		return; 
	}

	if(keyPress == 'ArrowUp' || keyPress == 'ArrowDown' || keyPress == 'ArrowLeft' || keyPress == 'ArrowRight'){
		const validMove = moveCharacter(keyPress);
		const playerNotDead = !mobAttack();
		if(validMove && playerNotDead){
			lockMoveWait();
		}
		
	}
	else if(keyPress == 'e'){
		if(!gameOver){ 
			mobAttack();
			enterStairs();
		}
	}
	else if (keyPress === 's' || keyPress === 'd' || (keyPress >= '1' && keyPress <= '9')) {
		mobAttack();
		if(train(keyPress)){
			lockMoveWait();
		}
	}
	else if(keyPress == 'a'){
		attack(keyPress);
		mobAttack();
	}

	return;
}

function dungeonBackground(dungeonDimension){
    let stringRepresentation = "";

    for(let j = 0; j < dungeonDimension[1]+2; j++){ 
		stringRepresentation += "-"; 
	}
    stringRepresentation += "<br>";
	for(let i = 0; i < dungeonDimension[0]; i++){
        stringRepresentation += "|";
        for(let j = 0; j < dungeonDimension[1]; j++){ 
			stringRepresentation += "&nbsp;" 
		}
        stringRepresentation += "|<br>";
    }
    for(let j = 0; j < dungeonDimension[1]+2; j++){ 
		stringRepresentation += "-"; 
	}

    return stringRepresentation;
}

function generateFloor(floorNum){
	const ENTITY_LOCATIONS = [];
	
	function generateLocation(floorDimension){ 
		return [Math.floor(Math.random()*floorDimension[0]), Math.floor(Math.random()*floorDimension[1])]; 
	}
	function randomMob(floorNum){ 
		return Math.floor(Math.random()*(Math.floor(floorNum/2))) % 6; 
	}

	function entityLocationIncludes(location){
		for(let i = 0; i < ENTITY_LOCATIONS.length; i++){
			if(ENTITY_LOCATIONS[i].loc[0] == location[0] && ENTITY_LOCATIONS[i].loc[1] == location[1]){
				return true;
			}
		}
		return false;
	}

	function placeObject(floorDimension, object, health){
		let objectLocation;
		do{
			objectLocation = generateLocation(floorDimension);
		} while(entityLocationIncludes(objectLocation));
		
		const entity = { ch: object, loc: objectLocation };
		if (health !== undefined) entity.health = health;
			
		ENTITY_LOCATIONS.push(entity);
	}
	
    const floorDimension = [Math.floor(Math.random()*10)+15, Math.floor(Math.random()*10)+15];
    placeObject(floorDimension, PLAYER);
    if(Math.random() <= 0.5){
		placeObject(floorDimension, TRAINER);
	}
	placeObject(floorDimension, STAIRS);
    for(let i = 0; i < Math.floor(Math.random()*5)+3; i++){
        placeObject(floorDimension, GOLD);
    }
    for(let i = 0; i < Math.floor((floorNum*3)/2); i++){
		const mobIndex = randomMob(floorNum);
        placeObject(floorDimension, MOBTYPES[mobIndex], mobIndex+1);
    }
	for(let i = 0; i < Math.floor(Math.random()*2); i++){
		placeObject(floorDimension, HEALTHPOTION);
	}

	LOCATIONS = ENTITY_LOCATIONS;
	FLOORDIMENSION = floorDimension;
    return;
}

function saveData(){
	if(LOCATIONS != null && FLOORDIMENSION != null){
		localStorage.setItem('loc', JSON.stringify(LOCATIONS));
		localStorage.setItem('fd', JSON.stringify(FLOORDIMENSION));
		localStorage.setItem('version', VERSION);
	}
	
	return;
}

function displayGameOver(endCondition){
	let finalText = endCondition > 0 ? '&#x1F389YOU WON&#x1F389' : 'GAME OVER'; 
	
	let score = 0;
	for(let i = 0; i < getPlayer().mobkilled.length; i++){
		score += getPlayer().mobkilled[i] * (i * 5)
	}
	score += getPlayer().gold * 2;
	score += (getPlayer().trainStat[0] + getPlayer().trainStat[1])


	const dungeonBackground = document.getElementById('dungeon-background');
	const entityLayer = document.getElementById('entity-layer');
	
	entityLayer.style.textAlign = 'center';
	entityLayer.innerHTML = `<b>${finalText}</b><br>Score: ${score}<br><br>Strength: ${getPlayer().RNGSTAT[0]}<small>+${getPlayer().trainStat[0]}</small><br>Defense: ${getPlayer().RNGSTAT[1]}<small>+${getPlayer().trainStat[1]}</small><br><br>Killed<br>%: ${getPlayer().mobkilled[0]}<br>\>: ${getPlayer().mobkilled[1]}<br>~: ${getPlayer().mobkilled[2]}<br>^: ${getPlayer().mobkilled[3]}<br>&: ${getPlayer().mobkilled[4]}<br>`;
	entityLayer.style.top = `${(dungeonBackground.clientHeight / 2) - (11 * CHARHEIGHT/2)}px`;
	entityLayer.style.left = `${((dungeonBackground.clientWidth / 2) - ((Math.floor('Strength: x+x'.length)/2) * CHARWIDTH)) + 1}px`;

	if(endCondition > 0){
		stars();
	}

	return;
}

function dungeonRefresh(floor){
	function getData(){
		if(Number(localStorage.getItem('version')) != VERSION){
			return false;
		}
		else if(localStorage.getItem('loc')  === null || localStorage.getItem('fd') === null){
			return false;
		}

		LOCATIONS = JSON.parse(localStorage.getItem('loc'));
		FLOORDIMENSION = JSON.parse(localStorage.getItem('fd'));
		return true;
	}
	
	if(!getData()){
		generateFloor(floor ?? 1);
		saveData();
		savePlayer();
	}

	const dungeonDiv = document.getElementById('dungeon-background');
	dungeonDiv.innerHTML = dungeonBackground(FLOORDIMENSION, true);
	if(gameOver != 0){
		displayGameOver(gameOver);
		return;
	}
	
	entitiesRefresh();
	return;
}

function stars(){
	var defaults = {
		spread: 360,
		ticks: 50,
		gravity: 0,
		decay: 0.94,
		startVelocity: 30,
		colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
	  };
	  
	  function shoot() {
		confetti({
		  ...defaults,
		  particleCount: 40,
		  scalar: 1.2,
		  shapes: ['star']
		});
	  
		confetti({
		  ...defaults,
		  particleCount: 10,
		  scalar: 0.75,
		  shapes: ['circle']
		});
	  }
	  
	  setTimeout(shoot, 0);
	  setTimeout(shoot, 100);
	  setTimeout(shoot, 200);
}