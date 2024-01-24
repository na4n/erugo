const ENTITIES = ['.', '@']

let FLOOR = getFloor(0);

function getFloor(floorNum){
    const f = getCookie('floor' + floorNum);
    if(f == null){
        let genFloor = generateFloor();
        setCookie('floor' + floorNum, JSON.stringify(genFloor), 400);
        return genFloor;
    }
    else{
        return JSON.parse(f);
    }
}

function displayFloor(dungeonArray){
    const dungeonDiv = document.getElementById('dungeon');
    stringRepresentation = "";

    for(let j = 0; j < dungeonArray[0].length+1; j++){
        stringRepresentation += "--";
    }
    stringRepresentation += "<br>";
    for(let i = 0; i < dungeonArray.length; i++){
        stringRepresentation += "|";
        for(let j = 0; j < dungeonArray[i].length; j++){
            if(dungeonArray[i][j] == '.'){
                stringRepresentation += "&nbsp;&nbsp;"
            }
        }
        stringRepresentation += "|<br>";
    }
    for(let j = 0; j < dungeonArray[0].length+1; j++){
        stringRepresentation += "--";
    }

    dungeonDiv.innerHTML = stringRepresentation;

}

function generateFloor(){
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

    return dungeon;
}
