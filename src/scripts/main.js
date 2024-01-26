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

function reset(){
	localStorage.removeItem('FLOOR');
	localStorage.removeItem('PLAYER');
	FLOOR = null;
	updateStats(getPlayer());
	displayFloor(getFloor());
}

function save(){
	localStorage.setItem('FLOOR', JSON.stringify(FLOOR));
	localStorage.setItem('PLAYER', JSON.stringify(getPlayer()));
}
