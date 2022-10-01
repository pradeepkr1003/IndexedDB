import BroswerDB from "./indexedDB.js";

var container = document.getElementsByClassName("container")[0];
var assets = {
    "Hamster1" : "https://images.unsplash.com/photo-1664575262619-b28fef7a40a4",
    "Hamster2" : "https://images.unsplash.com/photo-1664575262619-b28fef7a40a4",
    
}
let db = new BroswerDB("HamsterDB", 2);

async function downloadAssets(fileName, url, callback) {
    var request = await fetch(url);

    request.blob().then(blob => {
        console.log("blob: ", blob);
        // db.addData("Hamsters", { fileName: fileName, file: blob });
    })
}

for (const [key, value] of Object.entries(assets)) {
    downloadAssets(key,value, () => {
        console.log("downloaded");
    });
}