const VERSION = 4;

const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e', 'a', 's', 'd', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let gameOver = localStorage.getItem('gameOver') === null ? 0 : Number(localStorage.getItem('gameOver'));

document.addEventListener('DOMContentLoaded', function() {
	({ width: CHARWIDTH, height: CHARHEIGHT } = getCharacterDimensions('monospace', '@', '15.5px'));
	document.getElementById('msg').style.height = `${getCharacterDimensions('times', 'H', '16').height}` + 'px';
	enableDungeonEventListener();

	dungeonRefresh();
	updateStats();
	document.getElementById('dungeon').click();
	
	const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	if (isMobileDevice) {
		const buttonDiv = document.getElementById('arrow');
		buttonDiv.style.touchAction = 'none';
		buttonDiv.innerHTML = '<button id="input" onclick="keyHandler(`ArrowUp`);">Up</button><br><button id="input" onclick="keyHandler(`ArrowLeft`);">Left</button><button id="input" onclick="keyHandler(`ArrowRight`);">Right</button><br><button id="input" onclick="keyHandler(`ArrowDown`);">Down</button><br><br>';
		buttonDiv.innerHTML += '<button id="input" onclick="keyHandler(`e`)">E</button><a>&emsp;</a><button id="input" onclick="keyHandler(`s`)">S</button><button id="input" onclick="keyHandler(`d`);"">D</button><a>&emsp;</a><button id="input" onclick="keyHandler(`a`);">A</button><br><br>'
	}
});

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

	const d = document.getElementById('entity-layer');
	d.innerHTML = '';
	d.style.top = '0px';
	d.style.left = '0px';

	localStorage.clear();
	USER = null, FLOORDIMENSION = null, LOCATIONS = null;
	gameOver = 0;

	dungeonRefresh();
	updateStats();
	
	document.getElementById('dungeon').click();
}

function save(){
	saveData();
	savePlayer();
	localStorage.setItem('gameOver', gameOver);
	logMsg('Saved Game', FADE);
}

function getCharacterDimensions(fontType, character, fontSize) {
	const hiddenElement = document.createElement('div');
	hiddenElement.style.cssText = `font-size: ${fontSize}; font-family: ${fontType}; position: absolute; left: -9999px;`;
	hiddenElement.textContent = character;

	document.body.appendChild(hiddenElement);
	const rect = hiddenElement.getBoundingClientRect();
	document.body.removeChild(hiddenElement);

	return { height: rect.height, width: rect.width };
}

function collapseToggle(){
	const textDiv = document.getElementById('collapse');
	const legendDiv = document.getElementById('legend');
	textDiv.innerText =	legendDiv.style.display == 'none' ? ' <collapse>' : ' <expand>';
	legendDiv.style.display = legendDiv.style.display == 'none' ? 'block' : 'none';

}
