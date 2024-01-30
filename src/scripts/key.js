const VALID_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'e'];

function clickListen(){
	var myDiv = document.getElementById('dungeon');

	myDiv.addEventListener('click', function() {
		document.addEventListener('keydown', divKeyDownHandler);
		document.addEventListener('click', clickOutsideHandler);
	});

	function divKeyDownHandler(event) {
		if(VALID_KEYS.includes(event.key)){
			event.preventDefault();
			keyHandler(event.key);
		}
	}

	function clickOutsideHandler(event) {
		if (!myDiv.contains(event.target)) {
			document.removeEventListener('keydown', divKeyDownHandler);
			document.removeEventListener('click', clickOutsideHandler);
		}
	}
}