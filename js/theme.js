const WHITE = 'white';
const BLACK = 'black';

const osTheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark){
	document.body.style.backgroundColor = isDark ? BLACK : WHITE;
	document.body.style.color = isDark ? WHITE : BLACK;
	document.getElementById('title').style.color = isDark ? WHITE : BLACK;
}

function changeEventListener(add){
	function handleThemeChange(event){
 		setTheme(osTheme.matches);
	}			

	if(add){
		osTheme.addEventListener('change', handleThemeChange);
	}
	else{
		osTheme.removeEventListener('change', handleThemeChange);
	}
}


function toggleTheme(){
	const savedTheme = localStorage.getItem('theme');
	if(savedTheme == undefined){
		changeEventListener(false);
		if(osTheme.matches){
			localStorage.setItem('theme', 'light');
			setTheme(false);
		}
		else{
			localStorage.setItem('theme', 'dark');
			setTheme(true);
		}
	}
	else{
		if(savedTheme == 'light'){
			setTheme(true);
			if(osTheme.matches){
				localStorage.removeItem('theme');
				changeEventListener(true);
			}
		}
		else{
			setTheme(false);
			if(!osTheme.matches){
				localStorage.removeItem('theme');
				changeEventListener(true);
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", (event) => {
	const savedTheme = localStorage.getItem('theme');
	if(savedTheme == undefined){
		setTheme(osTheme.matches);
		changeEventListener(true);
	}
	else if(savedTheme == 'light'){
		setTheme(false);
	}
	else if(savedTheme == 'dark'){
		setTheme(true);
	}

	console.log("DOM fully loaded and parsed");

});


