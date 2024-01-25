const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open('storage', 1);
request.onerror() = function (event) {
    console.error('An error occurred opening IndexedDB');
    console.log(event);
};
request.onupgradeneeded() = function () {
    const db = request.result;
    const store = db.createObjectStore("playerData", {keypath: "id", autoIncrement: true});
    store.createIndex('player', 'player', {unique: false});
    store.createIndex('floor', 'floor', {unique: false});

};
request.onsuccess() = function () {
    const db = request.result;
    const transaction = db.transaction('storage', 'readwrite');
    const store = transaction.objectStore('storage');
    const playerIndex = store.index('player');
    const floorIndex = store.index('floor');

    store.put({id: 1, player: "player1", floor: "floor2"});
    const idQuery = store.get(1);
    const playerQuery = playerIndex.getAll('player1');
}


