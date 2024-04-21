document.addEventListener('DOMContentLoaded', function () {
	function getCharacterDimensions(fontType, character, fontSize) {
		const hiddenElement = document.createElement('div');
		hiddenElement.style.cssText = `font-size: ${fontSize}; font-family: ${fontType}; position: absolute; left: -9999px;`;
		hiddenElement.textContent = character;

		document.body.appendChild(hiddenElement);
		const rect = hiddenElement.getBoundingClientRect();
		document.body.removeChild(hiddenElement);

		return { height: rect.height, width: rect.width };
	}

	const updateCharacterDimensions = () => ({ width: CHARWIDTH, height: CHARHEIGHT } = getCharacterDimensions('monospace', '@', '15.5px'));

	updateCharacterDimensions();
	window.onresize = () => {
		updateCharacterDimensions();
		gameOver == 0 ? entitiesRefresh() : displayGameOver(gameOver);
	};

	displayDungeon();
	enableDungeonEventListener();
	document.getElementById('dungeon').click();
});

let gameOver = localStorage.getItem('gameOver') === null ? 0 : Number(localStorage.getItem('gameOver'));
const VERSION = 12;

function divKeyDownHandler(event) {
	const valid_keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e', 'a', 's', 'd', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	if (valid_keys.includes(event.key)) {
		keyHandler(event.key);
	}
}

function enableDungeonEventListener() {
	var myDiv = document.getElementById('dungeon');

	function enable(event) {
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

function delay(milliseconds) {
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

async function logMsg(message, option) {
	const msgDiv = document.getElementById('msg');

	if (msgDiv == null) {
		return;
	}

	clearInterval(interval);
	msgDiv.style.opacity = 1;
	msgDiv.innerHTML = message;

	if (option == FADE) {
		await fade(msgDiv);
	}
	else if (option == LOCK) {
		msgDiv.setAttribute('id', 'msg_lock');
	}
}

function reset() {
	logMsg('Reset Game', FADE);

	const entityLayerDiv = document.getElementById('entity-layer');
	entityLayerDiv.removeAttribute('innerHTML');
	entityLayerDiv.removeAttribute('style');

	localStorage.clear();

	storedPlayer = createNewPlayer();
	PLAYER = new Proxy(storedPlayer, setHandlerUpdateDOM);

	for (let attribute in storedPlayer) {
		PLAYER[attribute] = storedPlayer[attribute];
	}

	gameOver = 0;
	FLOORDIMENSION = createFloorDimension();
	LOCATIONS = generateFloor(1, FLOORDIMENSION);

	displayDungeon();

	save();
}

function save() {
	saveData();
	savePlayer();
	localStorage.setItem('gameOver', gameOver);
	logMsg('Saved Game', FADE);
}

function collapseToggle() {
	const textDiv = document.getElementById('collapse');
	const legendDiv = document.getElementById('legend');
	textDiv.innerText = legendDiv.style.display == 'none' ? ' <collapse>' : ' <expand>';
	legendDiv.style.display = legendDiv.style.display == 'none' ? 'block' : 'none';
}
