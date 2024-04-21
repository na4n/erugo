document.addEventListener('DOMContentLoaded', () => {
	if(VERSION != null && VERSION != localStorage.getItem('version')){
		reset();
	}
});

let CHARHEIGHT;
let CHARWIDTH;

const MOBTYPES = ['%', '>', '~', '^', '&'];
const CHARACTER = '@';
const STAIRS = '\\';
const TRAINER = '+';
const GOLD = '*';
const HEALTHPOTION = 'o';

let FLOORDIMENSION = JSON.parse(localStorage.getItem('floorDimension')) ?? createFloorDimension();
let LOCATIONS = JSON.parse(localStorage.getItem('locations')) ?? generateFloor(null, FLOORDIMENSION);

const messageColors = {
	attack: 'green',
	damage: 'red',
	gold: 'goldenrod',
	health: '#66CCFF',
	default: 'grey',
};
  
const ONE_SPACE_AWAY = 1.42;

function createFloorDimension() {
	return [Math.floor(Math.random() * 10) + 15, Math.floor(Math.random() * 10) + 15];   
}

async function dungeonMessage(message, color, up){
	let loc = structuredClone(LOCATIONS[0].loc);
	!up ? loc[0]++ : loc[0]--;

	const entityLayerDiv = document.getElementById('entity-layer');
	if(document.getElementById('dmg') !== null){
		document.getElementById('dmg').remove();
	}

	const div = document.createElement('div');
	div.innerHTML = `<b>${message}</b>`;

	let i, divId;
	if(up === undefined){
		divId = 'temp';
		i = 1;
	}
	else if(up){
		for(i = 1; i < 10; i++){
			if(document.getElementById(','.repeat(i)) == null){
				divId = ','.repeat(i);
				break;
			}
		}
	}
	else if(!up){
		for(i = 1; i < 10; i++){
			if(document.getElementById('.'.repeat(i)) == null){
				divId = '.'.repeat(i);
				break;
			}
		}
	}	
	div.id = divId;

	const lsz = Math.floor(message.length / 2) == 1 ? 0 : message.length / 2;
	const topVal = up || up === undefined ? `${CHARHEIGHT * (1 + loc[0] - (i-1))}px` : `${CHARHEIGHT * (1 + loc[0] + (i-1))}px`;
	Object.assign(div.style, {
		opacity: '1',
		color: color,
		float: 'left',
		position: 'absolute',
		left: `${CHARWIDTH * (-lsz + 1 + loc[1])}px`,
		top: topVal,
		backgroundColor: document.body.style.backgroundColor
	});

	entityLayerDiv.appendChild(div);		
	fade(div, 30);
	await delay(500);
	div.remove();
	
	return;
}

function mobAttack(){
	const playerLocation = LOCATIONS[0].loc;
	let playerDamage = 0, amt = 0;
	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch) && totalDistance(LOCATIONS[i].loc, playerLocation) <= ONE_SPACE_AWAY){
			let damageMap = new Map([
				['%', 1],
				['>', 2],
				['~', 3],
				['^', 4],
				['&', 5]
			]);

			amt = damageMap.get(LOCATIONS[i].ch) + Math.round(Math.random());
			amt /= ((PLAYER.baseStats[1] + PLAYER.defense) / 4);
			playerDamage += amt;
			dungeonMessage('-'+amt.toFixed(2), messageColors.damage, true);
		}
	}

	if(playerDamage > 0){	
		PLAYER.health -= playerDamage;
		if(PLAYER.health <= 0){
			PLAYER.health = 0;
			gameOver = -1;
			localStorage.setItem('gameOver', gameOver);
			savePlayer();
			displayGameOver(gameOver);
		}
		return PLAYER.health <= 0;
	}

	return false;
}

function totalDistance(loc1, loc2) { return Math.hypot(loc1[0] - loc2[0], loc1[1] - loc2[1]); }	

function moveEntities(){	
	const withinBounds = (c) => c[0] >= 0 && c[0] < FLOORDIMENSION[0] && c[1] >= 0 && c[1] < FLOORDIMENSION[1];
	
	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch)){			
			let targetLoc, stairsLoc;
			
			const playerLoc = LOCATIONS[0].loc;
			const trainerLoc = LOCATIONS[1].loc;
			if(LOCATIONS.length > 2){
				stairsLoc = LOCATIONS[2].loc;
			}
			
			if(totalDistance(playerLoc, LOCATIONS[i].loc) <= 5){
				targetLoc = playerLoc;
			}
			else{
				const arrLocs = [playerLoc, trainerLoc];
				if(stairsLoc != null){
					getEntityAtLocation(stairsLoc) === STAIRS && arrLocs.push(stairsLoc);
				}
				arrLocs.sort((a, b) => totalDistance(LOCATIONS[i].loc, a) - totalDistance(LOCATIONS[i].loc, b));
				targetLoc = arrLocs[0];
			}

			if(totalDistance(targetLoc, LOCATIONS[i].loc) < ONE_SPACE_AWAY){
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

function movePlayer(keyPress){
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

	const playerLocation = structuredClone(LOCATIONS[0].loc);

	let pressMap = new Map([
		['ArrowUp', [-1, 0]],
		['ArrowDown', [1, 0]],
		['ArrowLeft', [0, -1]],
		['ArrowRight', [0, 1]]
	]);
	const delta = pressMap.get(keyPress);
	playerLocation[0] += delta[0];
	playerLocation[1] += delta[1];
	
	if(validLocation(playerLocation) && [GOLD, HEALTHPOTION, STAIRS, null].includes(getEntityAtLocation(playerLocation))){
		if(locationIndex(playerLocation, STAIRS) != null){
			enterStairs();
			return false;
		}
		else{
			LOCATIONS[0].loc = playerLocation;

			let entityDivIndex;
			if(locationIndex(playerLocation, GOLD) != null){
				dungeonMessage('+1', messageColors.gold);
				PLAYER.gold += 1;
				
				entityDivIndex = locationIndex(playerLocation, GOLD)
			}
			else if(locationIndex(playerLocation, HEALTHPOTION) != null){							
				dungeonMessage(`+${(10-PLAYER.health).toFixed(2)}`, messageColors.health);
				PLAYER.health = 10;
				entityDivIndex = locationIndex(playerLocation, HEALTHPOTION);
			}

			if(entityDivIndex != null){
				removeEntityDiv(entityDivIndex);
				LOCATIONS.splice(entityDivIndex, 1);
			}

			const char = document.getElementById('0');
			char.style.left = CHARWIDTH * (playerLocation[1]+1) + 'px';
			char.style.top = CHARHEIGHT * (playerLocation[0]+1) + 'px';
	
			return true;
		}
	}
	else if(MOBTYPES.includes(getEntityAtLocation(playerLocation))){
		logMsg('Walking into the enemy is an odd approach...', FADE);
	}
	else if(getEntityAtLocation(playerLocation) === TRAINER){
		logMsg('Shove off punk');
	}
	else{
		logMsg('Can\'t walk there', FADE);
	}

	return false;
}

function enterStairs(){
	const stairsLoc = LOCATIONS.length > 2 && getEntityAtLocation(LOCATIONS[2].loc) === STAIRS ? LOCATIONS[2].loc : LOCATIONS[1].loc;
	const charLoc =  LOCATIONS[0].loc;
	
	if(totalDistance(stairsLoc, charLoc) >= ONE_SPACE_AWAY){
		logMsg('Too far, try inventing a teleporter', FADE);
		return false;
	}
	else if(PLAYER.level >= 10){
		gameOver = 1;
		localStorage.setItem('gameOver', 1);
		displayGameOver(1);
		return false;
	}
	else{
		FLOORDIMENSION = createFloorDimension();
		LOCATIONS = generateFloor(++PLAYER.level, FLOORDIMENSION);
		displayDungeon();
		save();
		return true;
	}
}

function train(key){
	if(totalDistance(LOCATIONS[0].loc, LOCATIONS[1].loc) > ONE_SPACE_AWAY){
		logMsg("Get closer he doesn't bite", FADE);
		return false;
	}

	if(key == 's' || key == 'd'){
		if(PLAYER.gold < 5){
			logMsg('Need 5 gold to train', FADE);
			return false;
		}
		else{
			
			key === 's' ? PLAYER.strength++ : PLAYER.defense++;
			const attribute = key === 's' ? 'Strength' : 'Defense'

			logMsg(`Paid 5 gold`, FADE);
			dungeonMessage(`+${attribute}`, messageColors.default, true);

			PLAYER.gold -= 5;
			return true;
		}
	}
	else{
		const numInput = Number(key);
		if(PLAYER.gold < numInput){
			logMsg(`Need ${numInput} gold`, FADE);
			return false;
		}
		else{
			PLAYER.gold -= numInput; 
			const amtAdded = ((PLAYER.health + numInput) > 10 ? 10 - PLAYER.health : numInput);
			dungeonMessage(`+${amtAdded.toFixed(2)}`, messageColors.health);
			PLAYER.health += amtAdded;
			logMsg(`Paid ${numInput} gold`, FADE);
			return true;
		}

	}
}

function attack(){	
	const charLoc = LOCATIONS[0].loc;
	let attacked = false;
	for(let i = 0; i < LOCATIONS.length; i++){
		if(totalDistance(charLoc, LOCATIONS[i].loc) <= ONE_SPACE_AWAY && MOBTYPES.includes(LOCATIONS[i].ch)){
			let dmg = Math.floor(((PLAYER.baseStats[0] + PLAYER.strength)) / 5);
			const attackDamage = dmg == 0 ? 1 + (Math.round(Math.random() * 20) / 20) : (dmg + (Math.round(Math.random() * 20) / 20));
			LOCATIONS[i].health -= attackDamage;
			if(LOCATIONS[i].health <= 0){
				logMsg('Killed ' + LOCATIONS[i].ch, FADE);
				PLAYER.mobKilled[MOBTYPES.indexOf(LOCATIONS[i].ch)]++;
				const goldAmt = new Map([['%', 1], ['>', 1], ['~', 2], ['^', 2], ['&', 3]]);
				PLAYER.gold += goldAmt.get(LOCATIONS[i].ch);
				removeEntityDiv(i);
				LOCATIONS.splice(i, 1);
				i -= 1;
			}
			dungeonMessage('-' + attackDamage.toFixed(2), messageColors.attack, false);
			attacked = true;
		}
	}

	if(!attacked){
		logMsg('You attacked air', FADE);
	}
	
	return attacked;
}

function keyHandler(keyPress){
	async function lockMoveWait(){
		const blockInput = (event) => event.preventDefault();
		
		document.removeEventListener('keydown', divKeyDownHandler)
		document.addEventListener('keydown', blockInput);

		moveEntities();

		document.removeEventListener('keydown', blockInput);
		document.addEventListener('keydown', divKeyDownHandler);
	}

	if(gameOver){ 
		return; 
	}

	if(keyPress == 'ArrowUp' || keyPress == 'ArrowDown' || keyPress == 'ArrowLeft' || keyPress == 'ArrowRight'){
		const validMove = movePlayer(keyPress);
		if(validMove && !mobAttack()){
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
		let attacked = attack(keyPress);
		const dead = mobAttack();
		if(attacked && !dead){
			lockMoveWait();
		}
	}

	return;
}

function dungeonBackground(floorDimension){
	const row = floorDimension[0];
	const col = floorDimension[1];
    
	let stringRepresentation = "";
	stringRepresentation += "-".repeat(col+2) + "<br>";
	stringRepresentation += ("|" + "&nbsp;".repeat(col) + "|<br>").repeat(row);
	stringRepresentation += "-".repeat(col+2);
    
	return stringRepresentation;
}

function generateFloor(floorNum, floorDimension){
	const entity_locations = [];
	
	function generateLocation(floorDimension){ 
		return [Math.floor(Math.random()*floorDimension[0]), Math.floor(Math.random()*floorDimension[1])]; 
	}
	function randomMob(floorNum){ 
		return Math.floor(Math.random()*(Math.floor(floorNum/2))) % 6; 
	}

	function entityLocationIncludes(location){
		for(let i = 0; i < entity_locations.length; i++){
			if(entity_locations[i].loc[0] == location[0] && entity_locations[i].loc[1] == location[1]){
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
			
		entity_locations.push(entity);
	}
	
    placeObject(floorDimension, CHARACTER);
    if(Math.random() <= 0.5){
		placeObject(floorDimension, TRAINER);
	}
	placeObject(floorDimension, STAIRS);
    for(let i = 0; i < Math.floor(Math.random()*5)+3; i++){
        placeObject(floorDimension, GOLD);
    }
	for(let i = 0; i < Math.floor((floorNum*3)/2) + Math.floor((Math.random()*5)); i++){
		const mobIndex = randomMob(floorNum);
        placeObject(floorDimension, MOBTYPES[mobIndex], mobIndex+1);
    }
	if(Math.random() <= (0.05 * floorNum)){
		placeObject(floorDimension, HEALTHPOTION);
	}

    return entity_locations;
}

function saveData(){
	localStorage.setItem('locations', JSON.stringify(LOCATIONS));
	localStorage.setItem('floorDimension', JSON.stringify(FLOORDIMENSION));
	localStorage.setItem('version', VERSION);
}

function displayGameOver(endCondition){
	const arr = ['&#x1F389', '&#x1F973', '&#x1F483', '&#x1F57A', '&#x1F37E', '&#x1F37B', '&#129321', '&#127880', '&#x1F9A9']
	let finalText = endCondition > 0 ? `${arr[Math.floor(Math.random()*(arr.length-1))]}YOU WON${arr[Math.floor(Math.random()*(arr.length-1))]}` : 'GAME OVER'; 
	
	const dungeonBackground = document.getElementById('dungeon-background');
	const entityLayer = document.getElementById('entity-layer');
	
	entityLayer.style.textAlign = 'center';
	entityLayer.innerHTML = `<b>${finalText}</b><br>Strength: ${storedPlayer.baseStats[0]}<small>+${storedPlayer.strength}</small><br>Defense: ${storedPlayer.baseStats[1]}<small>+${storedPlayer.defense}</small><br><br>Killed<br>%: ${storedPlayer.mobKilled[0]}<br>\>: ${storedPlayer.mobKilled[1]}<br>~: ${storedPlayer.mobKilled[2]}<br>^: ${storedPlayer.mobKilled[3]}<br>&: ${storedPlayer.mobKilled[4]}<br>`;
	entityLayer.style.top = `${(dungeonBackground.clientHeight / 2) - (11 * CHARHEIGHT/2)}px`;
	entityLayer.style.left = `${((dungeonBackground.clientWidth / 2) - ((Math.floor('Strength: x+x'.length)/2) * CHARWIDTH)) + 1}px`;

	return;
}

function displayDungeon(floor){
	const dungeonDiv = document.getElementById('dungeon-background');
	dungeonDiv.innerHTML = dungeonBackground(FLOORDIMENSION, true);
	
	gameOver != 0 ? displayGameOver(gameOver) : entitiesRefresh();
	
	return;
}
