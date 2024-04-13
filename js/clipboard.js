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
    
    const head = `Erugo @ na4n.github.io/erugo/\nScore: ${getScore()}\n\nLevel: ${USER.currentFloor} Gold: ${USER.gold}\nHealth: ${(USER.health).toFixed(2)} Strength: ${USER.trainStat[0]} Defense: ${USER.trainStat[1]}`;
    
    if (gameOver == 0) {
      event.clipboardData.setData("text/plain", `${head}\n${boardTextRepresentation()}`);
    } 
    else {
      event.clipboardData.setData("text/plain", `${head}\n\nGAME OVER\nKilled:\n%: ${USER.mobkilled[0]}\n>: ${USER.mobkilled[1]}\n~: ${USER.mobkilled[2]}\n^: ${USER.mobkilled[3]}\n&: ${USER.mobkilled[4]}`);
    }
});