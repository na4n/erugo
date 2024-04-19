let storedPlayer = JSON.parse(localStorage.getItem("player")) ?? createNewPlayer();
let PLAYER;

document.addEventListener('DOMContentLoaded', ()=>{
	PLAYER = new Proxy(storedPlayer, {
        set(target, property, value, receiver){
            const updateProperties = ['level', 'gold', 'health', 'strength', 'defense']
            if(updateProperties.includes(property)){
                target[property] = value;
                document.getElementById(property).innerText = `${property === 'health' ? value.toFixed(2) : value}`;
            }
        }
    });
});

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
    localStorage.setItem("player", JSON.stringify(PLAYER));
    return;
}