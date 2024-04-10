const THEMES = {
	WHITE: 'white',
	BLACK: 'black',
	DARK: 'dark',
	LIGHT: 'light'
}

const osTheme = window.matchMedia('(prefers-color-scheme: THEMES.DARK)');

// simple function to change theme to OS, event listeners require references
function changeTheme(){
	setTheme(osTheme.matches);
}

// Set specific DOM elements to dark if parameter isDark is true (light otherwise)
function setTheme(isDark){
	document.body.style.backgroundColor = isDark ? THEMES.BLACK : THEMES.WHITE;
	document.body.style.color = isDark ? THEMES.WHITE : THEMES.BLACK;
	document.getElementById('title').style.color = isDark ? THEMES.WHITE : THEMES.BLACK;
}

// Toggles theme based on clicking title element
function toggleTheme(){
	let currentTheme = localStorage.getItem('theme') ?? (osTheme.matches ? THEMES.DARK : THEMES.LIGHT); // gets saved theme or os theme if none saved
	currentTheme === THEMES.DARK ? setTheme(false) : setTheme(true); // apply appropriate theme to DOM

	if((currentTheme === THEMES.DARK && !osTheme.matches) || (currentTheme === THEMES.LIGHT && osTheme.matches)){ // if applied theme matches OS, set to default state (remove storage add change event listener)
		localStorage.removeItem('theme');
		osTheme.addEventListener('change', changeTheme); // for reference this will never repeat event listeners since switching on default will not be default
	}
	else{ // if applied theme != OS theme, then user prefers specific theme so add theme to storage and remove event listener
		localStorage.setItem('theme', (currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
		osTheme.removeEventListener('change', changeTheme);
	}

	return; //event listeners needed for OS theme = saved theme since user might switch os theme
}

// init, once DOM is loaded check storage for theme, apply event listener if default, set theme to OS (default) or saved
document.addEventListener("DOMContentLoaded", (event) => {
	let theme = localStorage.getItem('theme');
	if(theme == undefined){
		osTheme.addEventListener('change', changeTheme);	
		theme = (osTheme.matches ? THEMES.DARK : THEMES.LIGHT);
	}

	theme === THEMES.DARK ? setTheme(true) : setTheme(false);  
});

