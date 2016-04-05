var bgPort = chrome.runtime.connect({name: "content->background"});
bgPort.postMessage({"action":"register"});
bgPort.onMessage.addListener(function(msg) {
    switch(msg.action){
        case "keypress":
            var fetchResponse = new CustomEvent('fetchResponse', {"detail":msg});
            document.dispatchEvent(fetchResponse);
            break;
    }
});

document.addEventListener('myStoreEvent', function(event) {
    // console.log('myStoreEvent');
    // bgPort.postMessage({joke: "Knock knock2"});
});

var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('simple.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
