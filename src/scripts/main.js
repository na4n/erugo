let mode = 0;

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

function nightMode(){
	if(mode == 0){
		const body = document.body;
		body.style.backgroundColor = 'black';
		body.style.color = 'white';
		const dungeon = document.getElementById('dungeon');
		dungeon.style.backgroundColor = 'black';
		dungeon.style.color = 'white';
		mode = 1;
	}
	else{
		const body = document.body;
		body.style.backgroundColor = 'white';
		body.style.color = 'black';
		const dungeon = document.getElementById('dungeon');
		dungeon.style.backgroundColor = 'white';
		dungeon.style.color = 'black';
		mode = 0;
	}
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
