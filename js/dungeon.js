let LOCATIONS;
let FLOORDIMENSION;

let CHARHEIGHT;
let CHARWIDTH;

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
	
	const playerLocation = getLocationOfEntity('@');
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
	const stairsLoc = getLocationOfEntity('\\');
	const charLoc = getLocationOfEntity('@');
	
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
		displayAllEntities();
		updateStats(getPlayer());
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
	}
	else if(keyPress == 'e'){
		enterStairs();
	}
	else if(keyPress == 't'){
		const trainLoc = getLocationOfEntity('+');
		const charLoc = getLocationOfEntity('@');

		function secondKeyListen(event){
			
			document.removeEventListener('keydown', secondKeyListen);
		}

		if((Math.abs(trainLoc[0]-charLoc[0]) + Math.abs(trainLoc[1]-charLoc[1])) > 1){
			logMsg("You are too far from the trainer", FADE);
		}
		else{
			document.addEventListener('keydown', secondKeyListen);
		}
		updateStats();
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

		ENTITY_LOCATIONS.push({ch: object, loc: objectLocation});
	}

	function randomMob(floorNum){
		const mob_types = ['%', '>', '~', '^', '&'];
		return mob_types[Math.floor(Math.random()*(Math.floor(floorNum/2))) % 6];
	}
	
    const floorDimension = [Math.floor(Math.random()*20)+20, Math.floor(Math.random()*20)+20];
    placeObject(floorDimension, '+');
    placeObject(floorDimension, '@');
    placeObject(floorDimension, '\\');
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
		console.info('new floor created');
	}
	const dungeonDiv = document.getElementById('dungeon');
	dungeonDiv.insertAdjacentHTML('beforeend', dungeonBackground(FLOORDIMENSION, true));
	displayAllEntities();

	return;
}
