const WHITE = 'white';
const BLACK = 'black';
const DARK = 'dark';
const LIGHT = 'light';

const osTheme = window.matchMedia('(prefers-color-scheme: dark)');

// simple function to change theme to OS, event listeners require references
function changeTheme(){
	setTheme(osTheme.matches);
}

// Set specific DOM elements to dark if parameter isDark is true (light otherwise)
function setTheme(isDark){
	document.body.style.backgroundColor = isDark ? BLACK : WHITE;
	document.body.style.color = isDark ? WHITE : BLACK;
	document.getElementById('title').style.color = isDark ? WHITE : BLACK;
}

// Toggles theme based on clicking title element
function toggleTheme(){
	let currentTheme = localStorage.getItem('theme') ?? (osTheme.matches ? DARK : LIGHT); // gets saved theme or os theme if none saved
	console.log('storage: ' + localStorage.getItem('theme'));
	console.log('current theme: ' + currentTheme);

	currentTheme === DARK ? setTheme(false) : setTheme(true); // apply appropriate theme to DOM


	if((currentTheme === DARK && !osTheme.matches) || (currentTheme === LIGHT && osTheme.matches)){ // if applied theme matches OS, set to default state (remove storage add change event listener)
		localStorage.removeItem('theme');
		osTheme.addEventListener('change', changeTheme);
	}
	else{ // if applied theme != OS theme, then user prefers specific theme so add theme to storage and remove event listener
		const next = (currentTheme === DARK ? LIGHT : DARK);
		localStorage.setItem('theme', next);
		osTheme.removeEventListener('change', changeTheme);
	}

	return; //event listeners needed for OS theme = saved theme since user might switch os theme
}

// init, once DOM is loaded check storage for theme, apply event listener if default, set theme to OS (default) or saved
document.addEventListener("DOMContentLoaded", (event) => {
	let theme = localStorage.getItem('theme');
	if(theme == undefined){
		osTheme.addEventListener('change', changeTheme);	
	}

	theme = theme ?? (osTheme.matches ? DARK : LIGHT);
	theme === DARK ? setTheme(true) : setTheme(false);  
});

