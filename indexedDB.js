// check if support indexedDB

export default class BroswerDB{
    
    constructor(dbName, version) {
        this.isSupport = this.checkSupport();
        this.openDB(dbName, version);
    }

    checkSupport() {
        if (!window.indexedDB && !window.webkitIndexedDB && !window.mozIndexedDB && !window.msIndexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
            return false;
        }
        return true;
    }

    // createObjectStore(storeName, keyPath) {
    //     console.log("create: ", storeName);
    //     console.log("keyPath: ", keyPath);
    //     if (!this.request.objectStoreNames.contains(storeName)) {
    //         this.request.onupgradeneeded = event => {
    //             let db = event.target.result;
    //             db.createObjectStore(storeName, { keyPath: keyPath });
    //         }
    //         // this.request.createObjectStore(storeName, { keyPath: keyPath });
    //     }
    // }

    updatedb(event) {
        console.log("update");
        let db = event.target.result;

        if (!db.objectStoreNames.contains("Hamsters")) {
            db.createObjectStore("Hamsters", { keyPath: "fileName" });
        }
    }


    openDB(dbName, version) {
        if (!this.isSupport) return;
        this.request = window.indexedDB.open(dbName, version);

        this.request.onerror = event => console.log("error: ", event);
        this.request.onsuccess = event => console.log("success: ", event);

        // updatedb()
        this.request.onupgradeneeded = this.updatedb;

        // this.db.transaction("Hamsters", "readwrite")
        // this.request.result.transaction("Hamsters", "readwrite")
        // for (const [key, value] of Object.entries(this.storeObjs)) {
        //     if (!db.objectStoreNames.contains(key))
        //         this.createObjectStore(key, value);
        // }
    }

    addData(storeName, Obj) {
        if (!this.isSupport) return;
        // this.createObjectStore(storeName, Object.keys(Obj)[0]);
        // this.request.onupgradeneeded = event => {
        // let db = event.target.result;
        this.request.onupgradeneeded(event => {
            event.target.result.createObjectStore(storeName, { keyPath: Object.keys(Obj)[0] });
            console.log(storeName, { keyPath: Object.keys(Obj)[0] });
        })

        // }

        console.log("add: ", storeName);
        console.log(this.request);


        let transaction = this.request.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        if (!store.get(Obj[Object.keys(Obj)[0]])) {
            console.log("add: ", Obj);
            let request = store.add(Obj);
            request.onsuccess = event => console.log("add success: ", event);
            request.onerror = event => console.log("add error: ", event);
        }
        else console.log("already exist");
    }

    async getData(storeName, key) {
        if (!this.isSupport) return;

        let transaction = this.request.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);
        let request = store.get(key);

        request.onerror = event => console.log("error: ", event);
        request.onsuccess = event => console.log("success: ", event);

        return request.result;
    }

}

/*
var request = indexedDB.open("localdb", 3);
var db;

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function (event) {
    console.log("upgradeneeded");
    db = event.target.result;
    if (!db.objectStoreNames.contains("Files")) db.createObjectStore("Files", { keyPath: "fileName" });
    if (!db.objectStoreNames.contains("User")) db.createObjectStore("User", { keyPath: "infoType" });
};

async function getFiles(fileName) {
    var transaction = db.transaction("Files", "readonly");
    var objectStore = transaction.objectStore("Files");
    var request = await objectStore.get(fileName);
    request.onerror = function (event) {
        console.log("error: ");
    };

    return request;
}

function storeFile(blob, filename) {
    var transaction = db.transaction("Files", "readwrite");
    var store = transaction.objectStore("Files");
    var request = store.put({ fileName: filename, file: blob });

    request.onsuccess = function (event) {
        console.log("storeFile success");
    };
}

async function downloadFile(url, filename, callback) {
    var file = await fetch(url);

    file.blob().then((blob) => {
        storeFile(blob, filename);
    });

    callback();
}
*/