
const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e', 't'];

function enableDungeonEventListener() {
	var myDiv = document.getElementById('dungeon');

    myDiv.addEventListener('click', function () {
        document.addEventListener('keydown', divKeyDownHandler);
        document.addEventListener('click', clickOutsideHandler);
    });

    function divKeyDownHandler(event) {
		function ctrlSecond(event){
			if(event.key == 's'){
				event.preventDefault();
				save();
				document.removeEventListener('keydown', ctrlSecond);
			}
			else if(event.key == 'r'){
				event.preventDefault();
				reset();
				document.removeEventListener('keydown', ctrlSecond);
			}
		}
	
		if(event.key == 'Control'){
			event.preventDefault();
			document.addEventListener('keydown', ctrlSecond);
		}
		if (VALID_KEYS.includes(event.key)) {
			event.preventDefault();
			keyHandler(event.key);
		}
    }


    function clickOutsideHandler(event) {
        if (!myDiv.contains(event.target)) {
            document.removeEventListener('keydown', divKeyDownHandler);
            document.removeEventListener('click', clickOutsideHandler);
        }
    }
}

function addArrowKeyButtons(){
	if(/iPhone|iPad|iPod|Android|Windows Phone/i.test(navigator.userAgent)){
		const keyDiv = document.getElementById('arrow-keys');
		keyDiv.style.textAlign = 'center';
		keyDiv.innerHTML = '<button onclick="keyHandler(\'ArrowUp\')">Up</button>' + 
		'<br><button onclick="keyHandler(\'ArrowLeft\')">Left</button><button onclick="keyHandler(\'ArrowRight\')">Right</button><br>' +
		'<button onclick="keyHandler(\'ArrowDown\')">Down</button><br><br>' + 
		'<button onclick="keyHandler(\'e\')">E</button>';
	}
}

function setColorTheme(){
	const theme = getCookie('theme');
	if(theme == null || theme == '0'){
		const body = document.body;
		body.style.backgroundColor = 'white';
		body.style.color = 'black';
	}
	else{
		const body = document.body;
		body.style.backgroundColor = 'black';
		body.style.color = 'white';
	}
}

function toggleTheme(){
	let currentTheme = getCookie('theme');
	currentTheme == null || currentTheme == '0' ? currentTheme = '-1' : currentTheme = '0';
	setCookie('theme', currentTheme, 400);
	setColorTheme();
}

let interval;
function fadeOut(element) {
	var opacity = 1;
	interval = setInterval(function() {
		if (opacity > 0) {
			opacity -= 0.075;
			element.style.opacity = opacity;
		} 
		else {
			clearInterval(interval);
			element.style.opacity = 0;
		}
	}, 75);
}

const LOCK = 'lock';
const FADE = 'fade';
function logMsg(message, option){
	return;
	const msgDiv = document.getElementById('msg');
	if(msgDiv == null){
		return;
	}

	msgDiv.innerHTML = message;
	msgDiv.style.opacity = 1;
	clearInterval(interval);
	if(option == FADE){
		fadeOut(msgDiv);
	}
	else if(option == LOCK){
		msgDiv.setAttribute('id', 'msg_lock');
	}

	return;
}

function reset(){
	localStorage.clear();
	logMsg('Reset Game', FADE);
	const ddiv = document.getElementById('dungeon')
	ddiv.innerHTML = '<div id="entity-layer"></div>';
	dungeonInit();
	updateStats();
	ddiv.click();
}

function save(){
	saveData();
	savePlayer();
	logMsg('Saved Game', FADE);
}

function getCharacterDimensions(fontType, character, fontSize) { // LLM Generated
	const hiddenElement = document.createElement('div');
	hiddenElement.style.cssText = `font-size: ${fontSize}; font-family: ${fontType}; position: absolute; left: -9999px;`;
	hiddenElement.textContent = character;

	document.body.appendChild(hiddenElement);
	const rect = hiddenElement.getBoundingClientRect();
	document.body.removeChild(hiddenElement);

	return { height: rect.height, width: rect.width };
}

const setCookie = (name, value, days) => { document.cookie = `${name}=${value}; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}; path=/`; };
const getCookie = (name) => { const decodedCookie = decodeURIComponent(document.cookie); const cookies = decodedCookie.split(';'); return cookies.find(cookie => cookie.trim().startsWith(name + '='))?.split('=')[1] || null; };
const deleteCookie = (name) => { document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; };
