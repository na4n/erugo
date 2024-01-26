let BLOCKING_ENTITY_LOCATIONS = [];
let GOLD_LOCATIONS = [];
let FLOOR;

function loadDungeon(){	//populate DUNGEON and BLOCKING_ENTITY_LOCATIONS
	floor = getFloor();
	
	for(let i = 0; i < floor.length; i++){
		for(let j = 0; j < floor[0].length; j++){
			if(floor[i][j] != '.' && floor[i][j] != '*'){
				BLOCKING_ENTITY_LOCATIONS.push([i, j]);
			}
			else if(floor[i][j] == '*'){
				GOLD_LOCATIONS.push([i, j]);
			}
		}
	}
	
	FLOOR = floor;
}

function getEntityLocation(floor, entity){ //gets row and column of a dungeon entity
	for(let i = 0; i < floor.length; i++){
		for(let j = 0; j < floor[0].length; j++){
			if(floor[i][j] == entity){
				return [i, j];
			}	
		}
	}
	
	return [-1, -1];
}

function locationIsEntityLocation(dungeon, entityLocations, loc){
	for(let i = 0; i < entityLocations.length; i++){
		if(entityLocations[i][0] == loc[0] && entityLocations[i][1] == loc[1]){
			return i;
		}
	}
	
	return -1;
}

function moveCharacter(dungeon, keyPress){ //moves character
	const playerLocation = getEntityLocation(dungeon, '@');
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
			nextLocation = null;	
	}
	
	if(nextLocation == null){
		return 1;
	}
	
	if(nextLocation[0] >= 0 && nextLocation[0] < dungeon.length &&
	   nextLocation[1] >= 0 && nextLocation[1] < dungeon[0].length &&
	   locationIsEntityLocation(dungeon, BLOCKING_ENTITY_LOCATIONS, [nextLocation[0], nextLocation[1]]) == -1){
		
		dungeon[nextLocation[0]][nextLocation[1]] = '@';
		dungeon[playerLocation[0]][playerLocation[1]] = '.';
		
		if(locationIsEntityLocation(dungeon, GOLD_LOCATIONS, [nextLocation[0], nextLocation[1]]) != -1){
			getPlayer().increaseGold();
			GOLD_LOCATIONS.splice(locationIsEntityLocation(dungeon, GOLD_LOCATIONS, [nextLocation[0], nextLocation[1]]), 1);
		}
	
		return 0;
	}
	
	return 1;
}

function keyHandler(keyPress){//maps key presses to actions
	if(keyPress == 'ArrowUp' || keyPress == 'ArrowDown' || keyPress == 'ArrowLeft' || keyPress == 'ArrowRight'){
		const floor = getFloor();
		moveCharacter(floor, keyPress);
		FLOOR = floor;
		displayFloor(getFloor());
	}
	
	return;
}

function getFloor(){ //checks FLOOR, and localStorage for dungeon
	if(FLOOR == null){
		if(localStorage.getItem('FLOOR') == null){
			const newFloor = generateFloor(1);
			localStorage.setItem('FLOOR', JSON.stringify(newFloor));
			return newFloor;
		}
		else{
			return JSON.parse(localStorage.getItem('FLOOR'));
		}
	}
	else{
		return FLOOR;
	}
}

function displayFloor(dungeonArray, color){ //outputsFloor
    const dungeonDiv = document.getElementById('dungeon');
    stringRepresentation = "";

    for(let j = 0; j < dungeonArray[0].length+2; j++){
        stringRepresentation += "-";
    }
    stringRepresentation += "<br>";
    for(let i = 0; i < dungeonArray.length; i++){
        stringRepresentation += "|";
        for(let j = 0; j < dungeonArray[i].length; j++){
            if(dungeonArray[i][j] == '.'){
                stringRepresentation += "&nbsp;"
            }
            else if(dungeonArray[i][j] == '*'){
                stringRepresentation += '.';
            }
            else{
                stringRepresentation += dungeonArray[i][j];
            }
        }
        stringRepresentation += "|<br>";
    }
    for(let j = 0; j < dungeonArray[0].length+2; j++){
        stringRepresentation += "-";
    }

    dungeonDiv.innerHTML = stringRepresentation;
}

function generateFloor(floorNum){ //creates a floor
	function generateLocation(floorDimension){
		return [Math.floor(Math.random()*floorDimension[0]), Math.floor(Math.random()*floorDimension[1])];
	}

	function placeObject(dungeon, floorDimension, object){
		let objectLocation;
		do{
			objectLocation = generateLocation(floorDimension);
		} while(BLOCKING_ENTITY_LOCATIONS.includes(objectLocation));

		dungeon[objectLocation[0]][objectLocation[1]] = object;
		BLOCKING_ENTITY_LOCATIONS.push(objectLocation);
	}

	function randomMob(floorNum){
		const mob_types = ['%', '>', '~', '^', '&'];
		return mob_types[Math.floor(Math.random()*(Math.floor(floorNum/2)))];
	}
	
	
    const floorDimension = [Math.floor(Math.random()*20)+20, Math.floor(Math.random()*20)+20];
    let dungeon = new Array(floorDimension[0]);
    for(let i = 0; i < floorDimension[0]; i++){
        dungeon[i] = new Array(floorDimension[1]);
    }
    for(let i = 0; i < floorDimension[0]; i++){
        for(let j = 0; j < floorDimension[1]; j++){
            dungeon[i][j] = '.';
        }
    }

    placeObject(dungeon, floorDimension, '+');
    placeObject(dungeon, floorDimension, '@');
    placeObject(dungeon, floorDimension, '\\');
    for(let i = 0; i < 10; i++){
        placeObject(dungeon, floorDimension, '*');
    }
    for(let i = 0; i < Math.floor((floorNum*3)/2); i++){
        placeObject(dungeon, floorDimension, randomMob(floorNum));
    }

    return dungeon;
}
