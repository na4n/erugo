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
    
    const head = `Erugo @ na4n.github.io/erugo/\nScore: ${getScore()}\n\nLevel: ${PLAYER.currentFloor} Gold: ${PLAYER.gold}\nHealth: ${(PLAYER.health).toFixed(2)} Strength: ${PLAYER.trainStats[0]} Defense: ${PLAYER.trainStats[1]}`;
    
    if (gameOver == 0) {
      event.clipboardData.setData("text/plain", `${head}\n${boardTextRepresentation()}`);
    } 
    else {
      event.clipboardData.setData("text/plain", `${head}\n\nGAME OVER\nKilled:\n%: ${PLAYER.mobkilled[0]}\n>: ${PLAYER.mobkilled[1]}\n~: ${PLAYER.mobkilled[2]}\n^: ${PLAYER.mobkilled[3]}\n&: ${PLAYER.mobkilled[4]}`);
    }
});