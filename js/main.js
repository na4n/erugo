const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e'];
let isFirstKeyPress = false;

function clickListen() {
    var myDiv = document.getElementById('dungeon');

    myDiv.addEventListener('click', function () {
        document.addEventListener('keydown', divKeyDownHandler);
        document.addEventListener('click', clickOutsideHandler);
    });

    function divKeyDownHandler(event) {
		if (VALID_KEYS.includes(event.key)) {
			event.preventDefault();
			keyHandler(event.key);
		}
		else if(event.key == 't'){
			const trainLoc = getLocationOfEntity('+');
			const charLoc = getLocationOfEntity('@');
	
			if((Math.abs(trainLoc[0]-charLoc[0]) + Math.abs(trainLoc[1]-charLoc[1])) > 1){
				logAndClear("You are too far from the trainer");
			}
			else{
				document.addEventListener('keydown', secondKey);
			}
		}
    }

    function clickOutsideHandler(event) {
        if (!myDiv.contains(event.target)) {
            document.removeEventListener('keydown', divKeyDownHandler);
            document.removeEventListener('click', clickOutsideHandler);
        }
    }

	function secondKey(event){
		train(event.key);
		document.removeEventListener('keydown', secondKey);
	}
}

function addArrowKeyButtons(){
	function isMobile() {
		return /iPhone|iPad|iPod|Android|Windows Phone/i.test(navigator.userAgent);
	}

	if(isMobile()){
		const keyDiv = document.getElementById('arrow-keys');
		keyDiv.style.textAlign = 'center';
		keyDiv.innerHTML = '<button onclick="keyHandler(\'ArrowUp\')">Up</button>' + 
		'<br><button onclick="keyHandler(\'ArrowLeft\')">Left</button><button onclick="keyHandler(\'ArrowRight\')">Right</button><br>' +
		'<button onclick="keyHandler(\'ArrowDown\')">Down</button><br><br>' + 
		'<button onclick="keyHandler(\'e\')">E</button>';
	}
}

function getMonospaceCharacterDimensions(character, fontSize) {
	const hiddenElement = document.createElement('div');
	hiddenElement.style.cssText = `font-size: ${fontSize}; font-family: monospace; position: absolute; left: -9999px;`;
	hiddenElement.textContent = character;

	document.body.appendChild(hiddenElement);
	const rect = hiddenElement.getBoundingClientRect();
	document.body.removeChild(hiddenElement);

	return { height: rect.height, width: rect.width };
}

function getMode(){
	if(localStorage.getItem('mode') == null){
		localStorage.setItem('mode', 0);
		return 0;
	}
	else{
		return parseInt(localStorage.getItem('mode'));
	}
}

function colorTheme(theme){
	if(theme != 0){
		const body = document.body;
		body.style.backgroundColor = 'black';
		body.style.color = 'white';
	}
	else{
		const body = document.body;
		body.style.backgroundColor = 'white';
		body.style.color = 'black';
	}
}

function toggleTheme(){
	const mode = parseInt(localStorage.getItem('mode'));
	colorTheme(~mode);
	localStorage.setItem('mode', ~mode);
}


function fadeOut(element) {
	var opacity = 1;
	element.style.opacity = 1;
	var interval = setInterval(function() {
		if (opacity > 0) {
			opacity -= 0.075;
			element.style.opacity = opacity;
		} 
		else {
			clearInterval(interval);
			//element.innerHTML = "";
			element.style.opacity = 0;
		}
	}, 50);
}

async function logAndClear(errorMessage) {
	const errDiv = document.getElementById('error'); 
	if(errDiv.style.opacity != 0){
		return;
	}
	//if(errDiv.innerHTML == ""){
		errDiv.innerHTML = errorMessage;
		fadeOut(document.getElementById('error'));
	//}
}

function reset(){
	localStorage.clear();
	location.reload();
}

function save(){
	saveData();
	savePlayer();
}
/* Cookie Functions

function setCookie(name, value, daysToExpire) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);

    const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieString;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
*/
