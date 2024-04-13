let PLAYER = JSON.parse(localStorage.getItem("player")) ?? createNewPlayer();

function createNewPlayer() {
    return {
        baseStats: [Math.floor(Math.random() * 5) + 5,
                    Math.floor(Math.random() * 5) + 5],
        currentFloor: 1,
        gold: 0,
        health: 10.0,
        mobKilled: [0, 0, 0, 0, 0],
        trainStats: [0, 0]
    };
}

function savePlayer() {
    localStorage.setItem("player", JSON.stringify(PLAYER));
    return;
}

function updateStats() {
    if (PLAYER === null || PLAYER === undefined) {
        document.getElementById("stats").style.display = "none";
        return;
    }

    const LEVEL = document.getElementById("level");
    const GOLD = document.getElementById("gold");
    const HEALTH = document.getElementById("health");
    const STRENGTH = document.getElementById("strength");
    const DEFENSE = document.getElementById("defense");

    LEVEL.innerHTML = `${PLAYER.currentFloor}`;
    GOLD.innerHTML = `${PLAYER.gold}`;
    HEALTH.innerHTML = `${(PLAYER.health).toFixed(2)}`;
    STRENGTH.innerHTML = `${PLAYER.trainStats[0]}`;
    DEFENSE.innerHTML = `${PLAYER.trainStats[1]}`;

    return;
}
