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
    LEVEL.innerHTML = `${PLAYER.currentFloor}`;

    const GOLD = document.getElementById("gold");
    GOLD.innerHTML = `${PLAYER.gold}`;

    const HEALTH = document.getElementById("health");
    HEALTH.innerHTML = `${(PLAYER.health).toFixed(2)}`;

    const STRENGTH = document.getElementById("strength");
    STRENGTH.innerHTML = `${PLAYER.trainStats[0]}`;

    const DEFENSE = document.getElementById("defense");
    DEFENSE.innerHTML = `${PLAYER.trainStats[1]}`;

    return;
}
