addEventListener('copy', (event) => {
	event.preventDefault();

	const attackStat = `?+${PLAYER.strength}`;
	const defenseStat = `?+${PLAYER.defense}`;

	const head = `Erugo @ na4n.github.io/erugo/\n\nLevel: ${PLAYER.level}          Gold: ${PLAYER.gold}`
	const stats = `Health: ${PLAYER.health}\n\nStrength: ${attackStat}     Defense: ${defenseStat}`;

	event.clipboardData.setData("text/plain", gameOver === 0 ? `${head}\n${stats}\n${boardEntityRepresentation()}` : `${head}\n${boardMobsKilledRepresentation()}`);

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

function boardMobsKilledRepresentation(){
	const dungeonText = [((gameOver > 0) ? "YOU WON!" : "GAME OVER"), `Strength: ${PLAYER.baseStats[0]}+${PLAYER.strength}`, 
	`Defense: ${PLAYER.baseStats[1]}+${PLAYER.defense}`, " ",
	"Killed", `%: ${PLAYER.mobKilled[0]}`, `>: ${PLAYER.mobKilled[1]}`,
	`~: ${PLAYER.mobKilled[2]}`, `^: ${PLAYER.mobKilled[3]}`,
	`&: ${PLAYER.mobKilled[4]}`];
	
	const dungeonRowArr = dungeonBackgroundText().split("\n");
	
	const rows = FLOORDIMENSION[0], columns = FLOORDIMENSION[1];
	let rowStartIndex = 1+Math.floor(rows/2) - 5;

	const rowArrayDungeonText = dungeonRowArr.map((row, rowIndex) => {
		if(rowIndex >= rowStartIndex && rowIndex < rowStartIndex+10){
			const rowArr = row.split("");

			let colStartIndex = 1+Math.floor(columns/2)-Math.floor(dungeonText[rowIndex-rowStartIndex].length/2);
			for(let k = 0; k < dungeonText[rowIndex-rowStartIndex].length; k++){
				rowArr[colStartIndex++] = dungeonText[rowIndex-rowStartIndex][k];
			}

			return rowArr.join("");
		}

		return row;
	});

	return rowArrayDungeonText.join('\n');
}
