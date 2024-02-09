let LOCATIONS;
let FLOORDIMENSION;

let CHARHEIGHT;
let CHARWIDTH;

const MOBTYPES = ['%', '>', '~', '^', '&'];
const PLAYER = '@';
const STAIRS = '\\';
const TRAINER = '+';
const GOLD = '*';
const HEALTHPOTION = 'o';

function mobAttack(){
	const playerLocation = getLocationOfEntity(PLAYER);
	let playerDamage = 0;
	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch) && oneSpaceAway(LOCATIONS[i].loc, playerLocation) <= 1){
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
	}

	if(getPlayer().health <= 0){
		gameOver = -1;
		getPlayer().health = 0;
		localStorage.setItem('gameOver', -1);
		savePlayer();
		displayGameOver(-1);
	}

	updateStats();  
}

function moveEntities(){
	function totalDistance(loc1, loc2) { return Math.hypot(loc1[0] - loc2[0], loc1[1] - loc2[1]); }	
	const withinBounds = (c) => c[0] >= 0 && c[0] < FLOORDIMENSION[0] && c[1] >= 0 && c[1] < FLOORDIMENSION[1];
	function bfs(start, target) {
		const done = new Map(), stack = [start];
		const addToDone = (c) => done.set(c.toString(), true);
		target = new Set(target);
	
		while (stack.length) {
			const cur = stack.shift();
			addToDone(cur);
	
			const entityAtLoc = getEntityAtLocation(cur);
			if (entityAtLoc && target.has(entityAtLoc)) return cur;
	
			const neighbors = [[cur[0]+1,cur[1]], [cur[0]-1,cur[1]], [cur[0],cur[1]+1], [cur[0],cur[1]-1]];
	
			neighbors.forEach(n => {
				const nStr = n.toString();
				if (!done.has(nStr) && withinBounds(n)){ 
					stack.push(n);
					addToDone(n);
				}
			});
		}
	}

	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch)){
			let targetLoc = (LOCATIONS[i].target == false ? bfs(LOCATIONS[i].loc, [STAIRS, TRAINER]) : LOCATIONS[i].target);
			LOCATIONS[i].target = targetLoc;
			const playerLoc = getLocationOfEntity(PLAYER);
			
			if(totalDistance(playerLoc, LOCATIONS[i].loc) <= 5){
				targetLoc = playerLoc;
			}

			if(totalDistance(LOCATIONS[i].loc, targetLoc) <= 1){ continue; }

			const moveDistances = [[LOCATIONS[i].loc[0]+1, LOCATIONS[i].loc[1]], [LOCATIONS[i].loc[0]-1, LOCATIONS[i].loc[1]], [LOCATIONS[i].loc[0], LOCATIONS[i].loc[1]+1], [LOCATIONS[i].loc[0], LOCATIONS[i].loc[1]-1]];
			moveDistances.sort((a, b) => totalDistance(targetLoc, a) - totalDistance(targetLoc, b));
			let j = 0;
			while(j < 4){
				if(withinBounds(moveDistances[j]) && (getEntityAtLocation(moveDistances[j])===null || getEntityAtLocation(moveDistances[j] == GOLD))){
					if(removeEntity(moveDistances[j])){ i -= 1; }
					updateEntity(LOCATIONS[i].loc, moveDistances[j]);
					break;
				}
				j++;
			}
	 	}
	}

	displayAllEntities();
}

function displayAllEntities(){
	function displayEntity(character, row, column){
		const topPx = `${CHARHEIGHT * (1+row)}px`;
		const leftPx = `${CHARWIDTH * (1+column)}px`;
	
		const enttiyLayerDiv = document.getElementById('entity-layer');
		const addDiv = `<div id="entity"style=float:left;position:absolute;left:${leftPx};top:${topPx};>${character}</div>`;
		enttiyLayerDiv.insertAdjacentHTML('beforeend', addDiv);
	
		return true;
	}

	if(gameOver){ 
		return false; 
	}


	document.getElementById('entity-layer').innerHTML = '';
	for(let i = 0; i < LOCATIONS.length; i++){
		if(!displayEntity(LOCATIONS[i].ch, LOCATIONS[i].loc[0], LOCATIONS[i].loc[1])){
			console.log(`failed to display ${LOCATIONS[i].ch} at [${LOCATIONS[i].loc[0]}, ${LOCATIONS[i].loc[0]}]`);
		}
	}
	
	return true;
}

function getLocationOfEntity(entityCharacter){
	for(let i = 0; i < LOCATIONS.length; i++){
		if(LOCATIONS[i].ch == entityCharacter){
			return LOCATIONS[i].loc;
		}
	}
	return null;
}

function getEntityAtLocation(loc){
	for(let i = 0; i < LOCATIONS.length; i++){
		if(LOCATIONS[i].loc[0] == loc[0] && LOCATIONS[i].loc[1] == loc[1]){
			return LOCATIONS[i].ch;
		}
	}
	
	return null;
}

function updateEntity(loc, newLoc){
	for(let i = 0; i < LOCATIONS.length; i++){
		if(LOCATIONS[i].loc[0] == loc[0] && LOCATIONS[i].loc[1] == loc[1]){
			LOCATIONS[i].loc[0] = newLoc[0];
			LOCATIONS[i].loc[1] = newLoc[1];
			return true;
		}
	}
	
	return false;
}

function removeEntity(loc){
	for(let i = 0; i < LOCATIONS.length; i++){
		if(LOCATIONS[i].loc[0] == loc[0] && LOCATIONS[i].loc[1] == loc[1]){
			LOCATIONS.splice(i, 1);
			return true;
		}
	}
	return false;
}

function moveCharacter(keyPress){
	function validLocation(loc){ 
		return 0 <= loc[0] && loc[0] < FLOORDIMENSION[0] && 0 <= loc[1] && loc[1] < FLOORDIMENSION[1];  
	}
	
	const playerLocation = getLocationOfEntity(PLAYER);
	if(playerLocation == null){ 
		return false; 
	}
	
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

	if(validLocation(nextLocation) && [GOLD, HEALTHPOTION, null].includes(getEntityAtLocation(nextLocation))){
		if(getEntityAtLocation(nextLocation) == GOLD){
			removeEntity(nextLocation);
			getPlayer().gold += 1;
			updateStats();
		}
		else if(getEntityAtLocation(nextLocation) == HEALTHPOTION){
			removeEntity(nextLocation);
			getPlayer().health = (getPlayer().health + 1) >= 10 ? 10 : getPlayer().health + 1;
			updateStats();
		}
		updateEntity(playerLocation, nextLocation);
		displayAllEntities();
		return true;
	}

	logMsg('Cannot move there', FADE);
	return false;
}

function enterStairs(){
	const stairsLoc = getLocationOfEntity(STAIRS);
	const charLoc = getLocationOfEntity(PLAYER);
	
	if(oneSpaceAway(stairsLoc, charLoc) > 1){
		logMsg('You are too far from the stairs', FADE);
		return false;
	}
	else if(getPlayer().getFloorNumber() == 10){
		gameOver = 1;
		localStorage.setItem('gameOver', 1);
		displayGameOver(1);
		return false;
	}
	else{
		getPlayer().increaseFloorNumber();
		localStorage.removeItem('fd');
		localStorage.removeItem('loc');
		dungeonRefresh(getPlayer().getFloorNumber());
		updateStats();
		save();
		return true;
	}
}

function train(key){
	if(oneSpaceAway(getLocationOfEntity(PLAYER), getLocationOfEntity(TRAINER)) > 1){
		logMsg("You are too far from the trainer", FADE);
		return false;
	}

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
const oneSpaceAway = function(loc1, loc2){ 
	return Math.abs(loc1[0]-loc2[0])+Math.abs(loc1[1]-loc2[1]); 
};

function attack(){	
	const charLoc = getLocationOfEntity(PLAYER);
	let i = 0;
	for(let i = 0; i < LOCATIONS.length; i++){
		if(oneSpaceAway(charLoc, LOCATIONS[i].loc) <= 1 && MOBTYPES.includes(LOCATIONS[i].ch)){
			let dmg = Math.floor(((getPlayer().RNGSTAT[0] + getPlayer().getTrainStat()[0])) / 5);
			dmg == 0 ? LOCATIONS[i].health -= (1 + Math.round(Math.random())) : LOCATIONS[i].health -= (dmg + Math.round(Math.random())); 
			console.log(LOCATIONS[i].health);
			if(LOCATIONS[i].health <= 0){
				logMsg('You killed ' + LOCATIONS[i].ch, FADE);
				getPlayer().mobkilled[MOBTYPES.indexOf(LOCATIONS[i].ch)]++;
				removeEntity(LOCATIONS[i].loc);
			}
			else{
				logMsg('You attacked ' + LOCATIONS[i].ch, FADE);
			}
			
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
		moveCharacter(keyPress);
		lockMoveWait();
		mobAttack();
	}
	else if(keyPress == 'e'){
		if(!gameOver){ 
			enterStairs();
			//save(); 
		}
	}
	else if(keyPress == 's' || keyPress == 'd'){
		if(train(keyPress)){
			lockMoveWait();
		}
		mobAttack();
	}
	else if(keyPress == 'a'){
		attack(keyPress);
		displayAllEntities();
		mobAttack();
	}

	return;
}

function dungeonBackground(dungeonDimension){ //outputsFloor
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

function generateFloor(floorNum){ //creates a floor
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

	function placeObject(floorDimension, object, target, health){
		let objectLocation;
		do{
			objectLocation = generateLocation(floorDimension);
		} while(entityLocationIncludes(objectLocation));
		
		const entity = {ch: object, loc: objectLocation};
		if(target!==undefined){ 
			entity.target = false; 
		}
		if(health!==undefined){ 
			entity.health = health; 
		}
		
		ENTITY_LOCATIONS.push(entity);
	}
	
    const floorDimension = [Math.floor(Math.random()*15)+15, Math.floor(Math.random()*15)+15];
    placeObject(floorDimension, TRAINER);
    placeObject(floorDimension, PLAYER);
    placeObject(floorDimension, STAIRS);
    for(let i = 0; i < Math.floor(Math.random()*5)+3; i++){
        placeObject(floorDimension, GOLD);
    }
    for(let i = 0; i < Math.floor((floorNum*3)/2); i++){
		const mobIndex = randomMob(floorNum);
        placeObject(floorDimension, MOBTYPES[mobIndex], false, mobIndex+1);
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
	}
	
	return;
}

function displayGameOver(endCondition){
	let finalText = endCondition > 0 ? '&#x1F389YOU WON&#x1F389' : 'GAME OVER'; 
	
	const dungeonBackground = document.getElementById('dungeon-background');
	const entityLayer = document.getElementById('entity-layer');
	
	entityLayer.style.textAlign = 'center';
	entityLayer.innerHTML = `<b>${finalText}</b><br><br>Strength: ${getPlayer().RNGSTAT[0]}<small>+${getPlayer().trainStat[0]}</small><br>Defense: ${getPlayer().RNGSTAT[1]}<small>+${getPlayer().trainStat[1]}</small><br><br>Killed<br>%: ${getPlayer().mobkilled[0]}<br>\>: ${getPlayer().mobkilled[1]}<br>~: ${getPlayer().mobkilled[2]}<br>^: ${getPlayer().mobkilled[3]}<br>&: ${getPlayer().mobkilled[4]}<br>`;
	entityLayer.style.top = `${(dungeonBackground.clientHeight / 2) - (10 * CHARHEIGHT/2)}px`;
	entityLayer.style.left = `${((dungeonBackground.clientWidth / 2) - ((Math.floor('Strength: x+x'.length)/2) * CHARWIDTH)) + 1}px`;

	if(endCondition > 0){
		stars();
	}
	return;
}

function dungeonRefresh(floor){
	function getData(){
		if(localStorage.getItem('fd') != null && localStorage.getItem('loc') != null){
			FLOORDIMENSION = JSON.parse(localStorage.getItem('fd'));
			LOCATIONS = JSON.parse(localStorage.getItem('loc'));
			return true;
		}	
		
		return false;
	}
	
	if(!getData()){
		let floorNumber = floor === undefined ? 1 : floor;
		generateFloor(floorNumber);
		saveData();
	}
	const dungeonDiv = document.getElementById('dungeon-background');
	dungeonDiv.innerHTML = dungeonBackground(FLOORDIMENSION, true);
	if(gameOver != 0){
		displayGameOver(gameOver);
		return;
	}
	
	displayAllEntities();
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