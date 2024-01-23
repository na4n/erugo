// Game Below
const RNGSTAT = [Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1, Math.floor(Math.random()*10)+1];
const STATMAX = 15;
let trainStat = [0, 0, 0, 0];

function wait(seconds) {
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve('resolved');
	  }, seconds * 1000);
	});
}
  
async function logAndClear(errorMessage) {
	document.getElementById('error').innerHTML = errorMessage;
	const result = await wait(3);
	document.getElementById('error').innerHTML = "";
}

function refresh(){
	const pStat = document.getElementById('stats');
	let s = playerStatsString();
	s = s.replace(/\n/g, "<br>");
	pStat.innerHTML = s;
}

function playerStatsString(){
	//const stat = player_stats();
	return 'Health: ' + (RNGSTAT[0] + trainStat[0]) +
	'\nStrength: ' + (RNGSTAT[1] + trainStat[1]) +
	'\nIntelligence: ' + (RNGSTAT[2] + trainStat[2]) + 
	'\nDefense: ' + (RNGSTAT[3] + trainStat[3]);
}

function printStats(){	console.log(playerStatsString()); }

function statPrompt(){
	let stat = parseInt(prompt("Enter 1-4"));
	if(isNaN(stat) || stat < 1 || stat > 4){
		console.log('Enter a valid number');
		return;
	}

	incStat(stat-1);
}

function incStat(i){
	if((trainStat[i] + RNGSTAT[i] + 1) <= STATMAX){
		trainStat[i]++;
		refresh();
	}
	else{
		let text;
		switch(i){
			case 0:
				text = 'healthy';
				break;
			case 1:
				text = 'strong';
				break;
			case 2:
				text = 'smart';
				break;
			case 3:
				text = 'buff';
				break;
		}

		logAndClear('you are too ' + text);
	}
}


