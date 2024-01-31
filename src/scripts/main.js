
function arrowKeys(){
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

function getMode(){
	if(localStorage.getItem('mode') == null){
		localStorage.setItem('mode', 0);
		return 0;
	}
	else{
		return parseInt(localStorage.getItem('mode'));
	}
}

function setMode(mode){
	localStorage.setItem('mode', mode);
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
