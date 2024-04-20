document.addEventListener('DOMContentLoaded', function() {
	function getCharacterDimensions(fontType, character, fontSize) {
		const hiddenElement = document.createElement('div');
		hiddenElement.style.cssText = `font-size: ${fontSize}; font-family: ${fontType}; position: absolute; left: -9999px;`;
		hiddenElement.textContent = character;
	
		document.body.appendChild(hiddenElement);
		const rect = hiddenElement.getBoundingClientRect();
		document.body.removeChild(hiddenElement);
	
		return { height: rect.height, width: rect.width };
	}

	function enableMobileButtons(){
		const buttonDiv = document.getElementById('arrow');
		buttonDiv.style.touchAction = 'none';
		buttonDiv.innerHTML = '<button id="input" onclick="keyHandler(`ArrowUp`);">Up</button><br><button id="input" onclick="keyHandler(`ArrowLeft`);">Left</button><button id="input" onclick="keyHandler(`ArrowRight`);">Right</button><br><button id="input" onclick="keyHandler(`ArrowDown`);">Down</button><br><br>';
		buttonDiv.innerHTML += '<button id="input" onclick="keyHandler(`e`)">E</button><a>&emsp;</a><button id="input" onclick="keyHandler(`s`)">S</button><button id="input" onclick="keyHandler(`d`);"">D</button><a>&emsp;</a><button id="input" onclick="keyHandler(`a`);">A</button><br><br>'
	}

	({ width: CHARWIDTH, height: CHARHEIGHT } = getCharacterDimensions('monospace', '@', '15.5px'));		
	
	window.onresize = function(){
		({ width: CHARWIDTH, height: CHARHEIGHT } = getCharacterDimensions('monospace', '@', '15.5px'));	
		gameOver == 0 ? entitiesRefresh() : displayGameOver(gameOver);
	};
	
	const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	if (isMobileDevice) {
		enableMobileButtons();
	}

	displayDungeon();
	enableDungeonEventListener();
	document.getElementById('dungeon').click();
});

let gameOver = localStorage.getItem('gameOver') === null ? 0 : Number(localStorage.getItem('gameOver'));

const VERSION = 2;

const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e', 'a', 's', 'd', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function divKeyDownHandler(event) {
	if (VALID_KEYS.includes(event.key)) {
		event.preventDefault();
		keyHandler(event.key);
	}
}

function enableDungeonEventListener() {
	var myDiv = document.getElementById('dungeon');
	
	function enable(event){
		document.addEventListener('keydown', divKeyDownHandler);
		document.addEventListener('click', clickOutsideHandler);
	}

	function clickOutsideHandler(event) {
		var myDiv = document.getElementById('dungeon');
		if (event === null || !myDiv.contains(event.target)) {
			document.removeEventListener('keydown', divKeyDownHandler);
			document.removeEventListener('click', clickOutsideHandler);
		}
	}	

    myDiv.addEventListener('click', enable);
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

//replace with async request queue (max size 5?)
const FADE = 'FADE';
const LOCK = 'LOCK';
let interval;
let backlog = [];

async function fade(msgDiv, limit) {
    msgDiv.style.opacity = 1;
    let interval = setInterval(() => {
        if (msgDiv.style.opacity <= 0) {
            clearInterval(interval);
        } else {
            msgDiv.style.opacity -= 0.075;
        }
    }, limit || 50); // Using the provided limit if available, otherwise defaulting to 50
}

async function logMsg(message, option){
	const msgDiv = document.getElementById('msg');
	
	if(msgDiv == null){
		return;
	}
	
	clearInterval(interval);
	msgDiv.style.opacity = 1;
	msgDiv.innerHTML = message;

	if(option == FADE){ 
		await fade(msgDiv); 
	}
	else if(option == LOCK){ 
		msgDiv.setAttribute('id', 'msg_lock'); 
	}
}

function reset(){
	logMsg('Reset Game', FADE);

	const entityLayerDiv = document.getElementById('entity-layer');
	entityLayerDiv.innerHTML = '';
	entityLayerDiv.style.top = '0px';
	entityLayerDiv.style.left = '0px';

	localStorage.clear();

	storedPlayer = createNewPlayer();
	PLAYER = new Proxy(storedPlayer, setHandlerUpdateDOM);
	
	
	for(let attribute in storedPlayer){
		PLAYER[attribute] = storedPlayer[attribute];
	}

	gameOver = 0;
	FLOORDIMENSION = createFloorDimension();
	LOCATIONS = generateFloor(1, FLOORDIMENSION);

	displayDungeon();
	document.getElementById('dungeon').click();
	
	savePlayer();
	saveData();
}

function save(){
	saveData();										
	savePlayer();									
	localStorage.setItem('gameOver', gameOver);
	logMsg('Saved Game', FADE);
}

function collapseToggle(){
	const textDiv = document.getElementById('collapse');
	const legendDiv = document.getElementById('legend');
	textDiv.innerText =	legendDiv.style.display == 'none' ? ' <collapse>' : ' <expand>';
	legendDiv.style.display = legendDiv.style.display == 'none' ? 'block' : 'none';
}
