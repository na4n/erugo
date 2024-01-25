let ENTITY_LOCATIONS = [];

let FLOOR = generateFloor(0);

// function getFloor(floorNum){
//     const f = getCookie('floor' + floorNum);
//     if(f == null){
//         let genFloor = generateFloor(floorNum);
//         setCookie('floor' + floorNum, JSON.stringify(genFloor), 400);
//         return genFloor;
//     }
//     else{
//         return JSON.parse(f);
//     }
//}

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
            else if(dungeonArray[i][j] == '@'){
                    stringRepresentation += '@';
            }
            else if(dungeonArray[i][j] == '*'){
                stringRepresentation += '.';
            }
            else if(dungeonArray[i][j] == '+'){
                stringRepresentation += '+'
            }
            else if(dungeonArray[i][j] == '\\'){
                stringRepresentation += '\\'
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


function generateFloor(floorNum){
    const floorDimension = [Math.floor(Math.random()*30)+15, Math.floor(Math.random()*30)+15];
    let dungeon = new Array(floorDimension[0]);
    for(let i = 0; i < floorDimension[0]; i++){
        dungeon[i] = new Array(floorDimension[1]);
    }
    for(let i = 0; i < floorDimension[0]; i++){
        for(let j = 0; j < floorDimension[1]; j++){
            dungeon[i][j] = '.';
        }
    }

    // mobs, based on floorNum                  ^: bat %: goblin ~: worm 
    // door to next level

    placeObject(dungeon, floorDimension, '+');
    placeObject(dungeon, floorDimension, '@');
    placeObject(dungeon, floorDimension, '\\');
    for(let i = 0; i < 10; i++){
        placeObject(dungeon, floorDimension, '*');
    }

    return dungeon;
}
