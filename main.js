let CHANGE = 0;

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

function savePlayer(){
    if(getCookie('player') != null){
        deleteCookie('player');
    }

    setCookie('player', PLAYER.retrieveStat().toString(), 400);
}

function loadPlayer(){
    dat = getCookie('player');
    if(dat == null){
        return new Player();
    }
    else{
        statArr = dat.split(',');
        return new Player(statArr);
    }
}

function deletePlayer(){
    deleteCookie('player');
    PLAYER = null;
    updateStats();
}
