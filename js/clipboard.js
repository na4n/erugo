addEventListener('copy', (event) => {
	event.preventDefault();

	// const attackStat = gameOver === 0 ? `?+${PLAYER.strength}` : `${PLAYER.baseStats[0]}+${PLAYER.strength}`
	// const defenseStat = gameOver === 0 ? `?+${PLAYER.defense}` : `${PLAYER.baseStats[1]}+${PLAYER.defense}`

	// const head = `Erugo @ na4n.github.io/erugo/\n\nLevel: ${PLAYER.level}          Gold: ${PLAYER.gold}\nStrength: ${attackStat}     Defense: ${defenseStat}`;

	event.clipboardData.setData("text/plain", gameOver === 0 ? `${boardEntityRepresentation()}` : `${boardMobsKilledRepresentation()}`);
	

	// if (gameOver == 0) {
	// }
	// else{
	// 	event.clipboardData.setData("text/plain", `${boardMobsKilledRepresentation()}`);
	// }
});

const dungeonBackgroundText = () => {
	return dungeonBackground(FLOORDIMENSION).replaceAll("<br>", "\n").replaceAll("&nbsp;", " "); 
}

function boardEntityRepresentation() {
	const dungeonText = dungeonBackgroundText();
	
	const rowArrayDungeonText = dungeonText.split("\n").map((row, i) => {
		const rowArr = row.split("");
		LOCATIONS.forEach(entity => {
			if (entity.loc[0] + 1 === i) {
				rowArr[entity.loc[1] + 1] = entity.ch;
			}
		});
		return rowArr.join("");
	});

	return rowArrayDungeonText.join("\n");
}

const dungeonText = [((gameOver > 0) ? "YOU WON!" : "GAME OVER"), `Strength: ${PLAYER.baseStats[0]}+${PLAYER.strength}`, 
`Defense: ${PLAYER.baseStats[1]}+${PLAYER.defense}`, " ",
"Killed", `%: ${PLAYER.mobKilled[0]}`, `>: ${PLAYER.mobKilled[1]}`,
`~: ${PLAYER.mobKilled[2]}`, `^: ${PLAYER.mobKilled[3]}`,
`&: ${PLAYER.mobKilled[4]}`];

function boardMobsKilledRepresentation(){
	const dungeonRowArr = dungeonBackgroundText().split("\n");
	
	const rows = FLOORDIMENSION[0], columns = FLOORDIMENSION[1];
	let current = 1 + Math.floor(rows/2) - 5;

	let j = 0;
	const rowArrayDungeonText = dungeonRowArr.map((row, i) => {
		if(i === current){
			const rowArr = row.split("");
			let start = 1+Math.floor(columns/2)-Math.floor(dungeonText[j].length/2);
			for(let k = 0; k < dungeonText[j].length; k++){
				rowArr[start++] = dungeonText[j][k];
			}

			current++;
			j++;
			if(j >= 10){
				current = -1;
			}
			return rowArr.join("");
		}

		return row;
	});

	return rowArrayDungeonText.join('\n');
}
