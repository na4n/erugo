const VERSION = 2;

const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e', 'a', 's', 'd', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let gameOver = localStorage.getItem('gameOver') === null ? 0 : Number(localStorage.getItem('gameOver'));
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

function setTheme(){
	if(getCookie('theme') == null){
		setCookie('theme', 'sun', 400);
	}
	const titleDiv = document.getElementById('title');
	
	if(getCookie('theme') == 'sun' || getCookie('theme') === null){
		document.body.style.backgroundColor = 'white';
		document.body.style.color = 'black';
		titleDiv.style.textShadow = '0px 0px 4px #fdbc4b';
	}
	else{
		document.body.style.backgroundColor = 'black';
		document.body.style.color = 'white';
		titleDiv.style.textShadow = '0px 0px 4px #ffffff';
	}
}

function toggleTheme(){
	if(getCookie('theme') == 'sun'){
		setCookie('theme', 'moon', 400);
	}
	else{
		setCookie('theme', 'sun', 400);
	}
	setTheme();
}

const setCookie = (name, value, days) => { document.cookie = `${name}=${value}; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}; path=/`; };
const getCookie = (name) => { const decodedCookie = decodeURIComponent(document.cookie); const cookies = decodedCookie.split(';'); return cookies.find(cookie => cookie.trim().startsWith(name + '='))?.split('=')[1] || null; };
const deleteCookie = (name) => { document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; };
