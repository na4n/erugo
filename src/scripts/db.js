function addData(playerData, floorData){
	const indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB ||
	window.shimIndexedDB;

	const request = indexedDB.open("ErugoData", 1);
	
	request.onerror = function (event) {
	  console.error("An error occurred with IndexedDB");
	  console.error(event);
	};

	request.onupgradeneeded = function () {
	  const db = request.result;
	  const store = db.createObjectStore("user", { keyPath: "id" });
	  store.createIndex("player", "player", { unique: false });
	  store.createIndex("floor", "floor", {
		unique: false,
	  });
	};

	request.onsuccess = function () {
		const db = request.result;
		const transaction = db.transaction("user", "readwrite");
		const store = transaction.objectStore('user');
		
		store.put({id: 1, player: playerData, floor: floorData});
	};
}

function getData(){
	return new Promise (function(resolve){
	
	const indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB ||
	window.shimIndexedDB;

	const request = indexedDB.open("ErugoData", 1);
	
	request.onerror = function (event) {
	  console.error("An error occurred with IndexedDB");
	  console.error(event);
	};

	request.onupgradeneeded = function () {
	  const db = request.result;
	  const store = db.createObjectStore("user", { keyPath: "id" });
	  store.createIndex("player", "player", { unique: false });
	  store.createIndex("floor", "floor", {
		unique: false,
	  });
	};

	request.onsuccess = function () {
		const db = request.result;
		const transaction = db.transaction("user", "readwrite");
		const store = transaction.objectStore('user');
		
		const result = store.get(1);
		result.onsuccess = function(){
			if(result.result == null){
				console.log('no values so set localStorage values');
				localStorage.setItem('PLAYER', JSON.stringify(new Player()));
				localStorage.setItem('FLOOR', JSON.stringify(generateFloor(1)));
			}
			else{
				localStorage.setItem('PLAYER', result.result.player);
				localStorage.setItem('FLOOR', result.result.floor);
			}
		}
	};
	
	});
}

function deleteData(){
	const indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB ||
	window.shimIndexedDB;

	const request = indexedDB.open("ErugoData", 1);
	
	request.onerror = function (event) {
	  console.error("An error occurred with IndexedDB");
	  console.error(event);
	};

	request.onupgradeneeded = function () {
	  const db = request.result;
	  const store = db.createObjectStore("user", { keyPath: "id" });
	  store.createIndex("player", "player", { unique: false });
	  store.createIndex("floor", "floor", {
		unique: false,
	  });
	};

	request.onsuccess = function () {
		const db = request.result;
		const transaction = db.transaction("user", "readwrite");
		const store = transaction.objectStore('user');
		store.delete(1);
	};
}
