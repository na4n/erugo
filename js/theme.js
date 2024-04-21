const THEMES = {
	WHITE: 'white',
	BLACK: 'black',
	DARK: 'dark',
	LIGHT: 'light'
}

const osTheme = window.matchMedia('(prefers-color-scheme: dark)');
const setOSTheme = () => setTheme(osTheme.matches);

function setTheme(isDark) {
	document.body.style.backgroundColor = isDark ? THEMES.BLACK : THEMES.WHITE;
	document.body.style.color = isDark ? THEMES.WHITE : THEMES.BLACK;
	document.getElementById('title').style.color = isDark ? THEMES.WHITE : THEMES.BLACK;
}

function toggleTheme() {
	let currentTheme = localStorage.getItem('theme') ?? (osTheme.matches ? THEMES.DARK : THEMES.LIGHT);
	currentTheme === THEMES.DARK ? setTheme(false) : setTheme(true);

	if ((currentTheme === THEMES.DARK && !osTheme.matches) || (currentTheme === THEMES.LIGHT && osTheme.matches)) {
		localStorage.removeItem('theme');
		osTheme.addEventListener('change', setOSTheme);
	}
	else {
		localStorage.setItem('theme', (currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
		osTheme.removeEventListener('change', setOSTheme);
	}
}

document.addEventListener("DOMContentLoaded", (event) => {
	let theme = localStorage.getItem('theme');
	if (theme == undefined) {
		osTheme.addEventListener('change', setOSTheme);
		theme = (osTheme.matches ? THEMES.DARK : THEMES.LIGHT);
	}

	theme === THEMES.DARK ? setTheme(true) : setTheme(false);
});

