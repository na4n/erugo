function boardTextRepresentation(){
    const s = dungeonBackground(FLOORDIMENSION).replaceAll("<br>", "\n").replaceAll("&nbsp;", " ");

    let a = s.split("\n");
    for(let i = 0; i < FLOORDIMENSION[0]; i++){
        a[i+1] = a[i+1].split("");
    }    

    for(let i = 0; i < LOCATIONS.length; i++){
        a[(LOCATIONS[i].loc[0])+1][(LOCATIONS[i].loc[1])+1] = LOCATIONS[i].ch;
    }

    for(let i = 1; i < FLOORDIMENSION[0]+1; i++){
        a[i] = a[i].join("");
    }

    a = a.join("\n");
    return a;
}


addEventListener('copy', (event) => {
    event.preventDefault();

	const attackStat = gameOver === 0 ? PLAYER.trainStats[0] : `${PLAYER.trainStats[0]}+${PLAYER.baseStats[0]}`
	const defenseStat = gameOver === 0 ? PLAYER.trainStats[1] : `${PLAYER.trainStats[1]}+${PLAYER.baseStats[1]}`

    const head = `Erugo @ na4n.github.io/erugo/\nScore: ${getScore()}\n\nLevel: ${PLAYER.currentFloor} Gold: ${PLAYER.gold}\nHealth: ${(PLAYER.health).toFixed(2)} Strength: ${attackStat} Defense: ${defenseStat}`;
    
    if (gameOver == 0) {
      event.clipboardData.setData("text/plain", `${head}\n${boardTextRepresentation()}`);
    } 
    else {
      event.clipboardData.setData("text/plain", `${head}\n\nGAME OVER\nKilled:\n%: ${PLAYER.mobKilled[0]}\n>: ${PLAYER.mobKilled[1]}\n~: ${PLAYER.mobKilled[2]}\n^: ${PLAYER.mobKilled[3]}\n&: ${PLAYER.mobKilled[4]}`);
    }
});
