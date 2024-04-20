const setHandlerUpdateDOM = {
    set(target, key, value){
        if(key in target){
            target[key] = value;
            const updateDOMProperties = ['level', 'gold', 'health', 'strength', 'defense']
            if(updateDOMProperties.includes(key)){
                document.getElementById(key).innerText = `${key === 'health' ? value.toFixed(2) : value}`;
            }
            return true;
        }
        return false;
    }
}

let storedPlayer = JSON.parse(localStorage.getItem("player")) ?? createNewPlayer();
let PLAYER = new Proxy(storedPlayer, setHandlerUpdateDOM);

function createNewPlayer() {
    return {
        baseStats: [Math.floor(Math.random() * 5) + 5,
                    Math.floor(Math.random() * 5) + 5],
        level: 1,
        gold: 0,
        health: 10.0,
        strength: 0,
        defense: 0,
        mobKilled: [0, 0, 0, 0, 0]
    };
}

function savePlayer() {
    localStorage.setItem("player", JSON.stringify(storedPlayer));
    return;
}
