let ENTITY_LOCATIONS = [];

function getFloor(){
	if(localStorage.getItem('FLOOR') == null){
		const newFloor = generateFloor(1);
		localStorage.setItem('FLOOR', JSON.stringify(newFloor));
		return newFloor;
	}
	else{
		return JSON.parse(localStorage.getItem('FLOOR'));
	}
}

function RNG(){
    return;
}

function displayFloor(dungeonArray, color){
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

function generateLocation(floorDimension){
    return [Math.floor(Math.random()*floorDimension[0]), Math.floor(Math.random()*floorDimension[1])];
}

function placeObject(dungeon, floorDimension, object){
    let objectLocation;
    do{
        objectLocation = generateLocation(floorDimension);
    } while(ENTITY_LOCATIONS.includes(objectLocation));

    dungeon[objectLocation[0]][objectLocation[1]] = object;
    ENTITY_LOCATIONS.push(objectLocation);
}

function randomMob(floorNum){
    const mob_types = ['%', '>', '~', '^', '&'];
    return mob_types[Math.floor(Math.random()*(Math.floor(floorNum/2)))];
}

function generateFloor(floorNum){
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

function roughSizeOfObject(object) {
    const objectList = [];
    const stack = [object];
    let bytes = 0;
  
    while (stack.length) {
      const value = stack.pop();
  
      switch (typeof value) {
        case 'boolean':
          bytes += 4;
          break;
        case 'string':
          bytes += value.length * 2;
          break;
        case 'number':
          bytes += 8;
          break;
        case 'object':
          if (!objectList.includes(value)) {
            objectList.push(value);
            for (const prop in value) {
              if (value.hasOwnProperty(prop)) {
                stack.push(value[prop]);
              }
            }
          }
          break;
      }
    }
  
    return bytes;
}

// TESTING


// function generateMAXArray(){
//     const arr = new Array(40);
//     for(let i = 0; i < arr.length; i++){
//         arr[i] = new Array(40);
//         for(let j = 0; j < arr[i].length; j++){
//             arr[i][j] = '@';
//         }
//     }
//     return arr;
// }

// // Encode array into a string
// function encodeArray(arr) {
//     return arr.join(',');
// }

// // Decode string back into an array
// function decodeString(encodedString) {
//     return encodedString.split(',');
// }
