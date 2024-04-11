function boardBaby(){
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
    
    const head = `Erugo @ na4n.github.io/erugo/\nScore: ${getScore()}\n\nLevel: ${getPlayer().currentFloor} Gold: ${getPlayer().gold}\nHealth: ${(getPlayer().health).toFixed(2)} Strength: ${getPlayer().trainStat[0]} Defense: ${getPlayer().trainStat[1]}`;
    
    if (gameOver == 0) {
      event.clipboardData.setData("text/plain", `${head}\n${boardBaby()}`);
    } 
    else {
      event.clipboardData.setData("text/plain", `${head}\n\nGAME OVER\nKilled:\n%: ${getPlayer().mobkilled[0]}\n>: ${getPlayer().mobkilled[1]}\n~: ${getPlayer().mobkilled[2]}\n^: ${getPlayer().mobkilled[3]}\n&: ${getPlayer().mobkilled[4]}`);
    }
  })