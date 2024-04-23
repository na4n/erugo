addEventListener('copy', (event) => {
	event.preventDefault();

	const attackStat = gameOver === 0 ? `?+${PLAYER.strength}` : `${PLAYER.baseStats[0]}+${PLAYER.strength}`
	const defenseStat = gameOver === 0 ? `?+${PLAYER.defense}` : `${PLAYER.baseStats[1]}+${PLAYER.defense}`

	const head = `Erugo @ na4n.github.io/erugo/\n\nLevel: ${PLAYER.level}          Gold: ${PLAYER.gold}\nStrength: ${attackStat}     Defense: ${defenseStat}`;

	if (gameOver == 0) {
		event.clipboardData.setData("text/plain", `${head}\nHealth: ${(PLAYER.health).toFixed(2)}\n${boardEntityRepresentation()}`);
	}
	else {
		event.clipboardData.setData("text/plain", `${head}\n\nGAME OVER\nKilled:\n%: ${PLAYER.mobKilled[0]}\n>: ${PLAYER.mobKilled[1]}\n~: ${PLAYER.mobKilled[2]}\n^: ${PLAYER.mobKilled[3]}\n&: ${PLAYER.mobKilled[4]}`);
	}
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

function boardGameOverRepresentation(){
	const dungeonText = dungeonBackgroundText(); //dungeonBackground(FLOORDIMENSION).replaceAll("<br>", "\n").replaceAll("&nbsp;", " ");
	return 1;
}
