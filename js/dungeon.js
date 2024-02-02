let LOCATIONS;
let FLOORDIMENSION;

let CHARHEIGHT;
let CHARWIDTH;

const MOBTYPES = ['%', '>', '~', '^', '&'];
const PLAYER = '@';
const STAIRS = '\\';
const TRAINER = '+';

const dist = function(loc1, loc2){
	return Math.abs(loc1[0]-loc2[0])+Math.abs(loc1[1]-loc2[1]);
};

function moveEntities(){
	function bfs(start, target) {
		const done = new Map(), stack = [start];
		const addToDone = (c) => done.set(c.toString(), true);
		const withinBounds = (c) => c[0] >= 0 && c[0] < FLOORDIMENSION[0] && c[1] >= 0 && c[1] < FLOORDIMENSION[1];
		target = new Set(target);

		while (stack.length) {
			const cur = stack.shift();
			addToDone(cur);

			const entityAtLoc = getEntityAtLocation(cur);
			if (entityAtLoc && target.has(entityAtLoc)) return cur;
	
			const neighbors = [[cur[0]+1,cur[1]], [cur[0]-1,cur[1]], [cur[0],cur[1]+1], [cur[0],cur[1]-1]];
	
			neighbors.forEach(n => {
				const nStr = n.toString();
				if (!done.has(nStr) && withinBounds(n)) stack.push(n);
				console.log(n);
			});
		}
	}

	for(let i = 0; i < LOCATIONS.length; i++){
		if(MOBTYPES.includes(LOCATIONS[i].ch)){
			//console.log('found a mob at ' + LOCATIONS[i].loc);
			//console.log(FLOORDIMENSION);
			let targetLoc = (LOCATIONS[i].target == false ? bfs(LOCATIONS[i].loc, [STAIRS, TRAINER]) : LOCATIONS[i].target);
			LOCATIONS[i].target = targetLoc;
			console.log(targetLoc);
			continue;
			const playerLoc = getLocationOfEntity(PLAYER);
			const playerDist = dist(LOCATIONS[i].loc, playerLoc);
			
			if(dist(playerLoc, LOCATIONS[i].loc) <= 5){
				targetLoc = playerLoc;
			}

			if(dist(targetLoc, LOCATIONS[i].loc) <= 1){
				if(getEntityAtLocation(targetLoc) == PLAYER){
					logMsg('Player was attacked', FADE);
				}
				continue;
			}

			const h = (targetLoc[1] < LOCATIONS[i].loc[1] ? -1 : (targetLoc[1] == LOCATIONS[i].loc[1] ? 0 : 1));
			const v = (targetLoc[0] < LOCATIONS[i].loc[0] ? -1 : (targetLoc[0] == LOCATIONS[i].loc[0] ? 0 : 1));
			
			let attempt = 0;
			let tryloc;
			while(attempt < 4){
				tryloc = [LOCATIONS[i].loc[0], LOCATIONS[i].loc[1]];
				switch (attempt % 2 == 0){
					case true:
						attempt >= 2 ? tryloc[0]-=v : tryloc[0]+=v;
						break;
					case false:
						attempt >= 2 ? tryloc[1]-=h : tryloc[1]+=h;
						break;
					default:
						break;
				};
			
				if(!getEntityAtLocation(tryloc)===null && getEntityAtLocation(tryloc) != '*'){
					attempt++;
				}
				else{
					//removeEntity(tryloc);
					updateEntity(LOCATIONS[i].loc, tryloc);
					break;
				}
			}
	 	}
	}

	displayAllEntities();
}


function displayAllEntities(locations){
	function displayEntity(character, row, column){
		const topPx = "" + CHARHEIGHT * (1+row) + "px";
		const leftPx = "" + CHARWIDTH * (1+column) + "px";
	
		const d = document.getElementById('entity-layer');
		const addDiv = '<div id="entity"style=float:left;position:absolute;left:' + leftPx + ';top:' + topPx + ';>' + character + '</div>';
	
		d.insertAdjacentHTML('beforeend', addDiv);
	
		return addDiv;
	}
	
	if(locations == null){
		locations = LOCATIONS;
	}

	document.getElementById('entity-layer').innerHTML = "";
	for(let i = 0; i < locations.length; i++){
		displayEntity(locations[i].ch, locations[i].loc[0], locations[i].loc[1]);
	}
	
	return;
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
		}
	}
	
	return null;
}

function removeEntity(loc){
	for(let i = 0; i < LOCATIONS.length; i++){
		if(LOCATIONS[i].loc[0] == loc[0] && LOCATIONS[i].loc[1] == loc[1]){
			LOCATIONS.splice(i, 1);
			return;
		}
	}
	return;
}

function moveCharacter(keyPress){ //moves character
	function validLocation(loc){
		return 0 <= loc[0] && loc[0] < FLOORDIMENSION[0] && 0 <= loc[1] && loc[1] < FLOORDIMENSION[1];
	}
	
	const playerLocation = getLocationOfEntity(PLAYER);
	if(playerLocation == null){
		return -1;
	}
	
	let nextLocation;
	switch(keyPress){
		case "ArrowUp":
			nextLocation = [playerLocation[0]-1, playerLocation[1]];
			break;
		case "ArrowDown":
			nextLocation = [playerLocation[0]+1, playerLocation[1]];
			break;
		case "ArrowLeft":
			nextLocation = [playerLocation[0], playerLocation[1]-1];
			break;
		case "ArrowRight":
			nextLocation = [playerLocation[0], playerLocation[1]+1];
			break;
		default:
			return 1;
	}
	
	if(validLocation(nextLocation) && getEntityAtLocation(nextLocation) == null || getEntityAtLocation(nextLocation) == '*'){
		let set = false;
		if(getEntityAtLocation(nextLocation) == '*'){
			removeEntity(nextLocation);
			getPlayer().setGold(getPlayer().getGold()+1);
			set = true;
		}
		updateEntity(playerLocation, nextLocation);
		return set;
	}
	
	return -1;
}

function enterStairs(){
	const stairsLoc = getLocationOfEntity(STAIRS);
	const charLoc = getLocationOfEntity(PLAYER);
	
	if((Math.abs(stairsLoc[0]-charLoc[0]) + Math.abs(stairsLoc[1]-charLoc[1])) > 1){
		logMsg('You are too far from the stairs', FADE);
	}
	else if(getPlayer().getFloorNumber() == 10){
		logMsg('You win', LOCK);
	}
	else{
		getPlayer().increaseFloorNumber();
		generateFloor(getPlayer().getFloorNumber());
		const dungeonDiv = document.getElementById('dungeon');
		dungeonDiv.innerHTML = '<div id="entity-layer"></div>'
		dungeonDiv.insertAdjacentHTML('beforeend', dungeonBackground(FLOORDIMENSION, true));
		console.log('printed out dungeon');
		displayAllEntities();
		console.log('displayed all entities');
		updateStats(getPlayer());
		console.log('updatedfafaf');
	}

	return;
}

function train(key){
	if(key != '1' && key != '2' && key != '3' && key != '4'){
		logMsg('Invalid Attribute, must be 1-4', FADE);
	}
	else{
		let p = getPlayer();
		if(p.getGold() < 10){
			logMsg('Not enough gold, need 10 to train 1 attribute', FADE);
		}
		else{
			p.setTrainStat(parseInt(key)-1);
			p.setGold(p.getGold()-10);
		}
	}

	return;
}

function keyHandler(keyPress){//maps key presses to actions
	console.log(keyPress);

	if(keyPress == 'ArrowUp' || keyPress == 'ArrowDown' || keyPress == 'ArrowLeft' || keyPress == 'ArrowRight'){
		const move = moveCharacter(keyPress);
		if(move < 0){
			logMsg('Can\'t move there', FADE);
		}
		else{
			displayAllEntities();
		}

		if(move == 1){
			updateStats();
		}
		moveEntities();
	}
	else if(keyPress == 'e'){
		enterStairs();
	}
	else if(keyPress == 't'){
		const trainLoc = getLocationOfEntity(TRAINER);
		const charLoc = getLocationOfEntity(PLAYER);

		function secondKeyListen(event){
			if(VALID_KEYS.includes(event.key)){
				document.removeEventListener('keydown', secondKeyListen);
			}
			else{
				train(event.key);
			}
		}

		if((Math.abs(trainLoc[0]-charLoc[0]) + Math.abs(trainLoc[1]-charLoc[1])) > 1){
			logMsg("You are too far from the trainer", FADE);
		}
		else{
			document.addEventListener('keydown', secondKeyListen);
		}
		updateStats();
		moveEntities();
	}
	
	return;
}

function dungeonBackground(dungeonDimension){ //outputsFloor
    stringRepresentation = "";

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

	function entityLocationIncludes(location){
		for(let i = 0; i < ENTITY_LOCATIONS.length; i++){
			if(ENTITY_LOCATIONS[i].loc[0] == location[0] && ENTITY_LOCATIONS[i].loc[1] == location[1]){
				return true;
			}
		}
		return false;
	}

	function placeObject(floorDimension, object){
		let objectLocation;
		do{
			objectLocation = generateLocation(floorDimension);
		} while(entityLocationIncludes(objectLocation));

		ENTITY_LOCATIONS.push({ch: object, loc: objectLocation, target: false});
	}

	function randomMob(floorNum){
		return MOBTYPES[Math.floor(Math.random()*(Math.floor(floorNum/2))) % 6];
	}
	
    const floorDimension = [Math.floor(Math.random()*20)+20, Math.floor(Math.random()*20)+20];
    placeObject(floorDimension, TRAINER);
    placeObject(floorDimension, PLAYER);
    placeObject(floorDimension, STAIRS);
    for(let i = 0; i < 10; i++){
        placeObject(floorDimension, '*');
    }
    for(let i = 0; i < Math.floor((floorNum*3)/2); i++){
        placeObject(floorDimension, randomMob(floorNum));
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

function dungeonInit(){
	function getData(){
		if(localStorage.getItem('fd') != null && localStorage.getItem('loc') != null){
			FLOORDIMENSION = JSON.parse(localStorage.getItem('fd'));
			LOCATIONS = JSON.parse(localStorage.getItem('loc'));
			return true;
		}	
		
		return false;
	}
	
	if(!getData()){
		generateFloor(1);
		saveData();
	}
	const dungeonDiv = document.getElementById('dungeon');
	dungeonDiv.insertAdjacentHTML('beforeend', dungeonBackground(FLOORDIMENSION, true));
	displayAllEntities();

	return;
}
