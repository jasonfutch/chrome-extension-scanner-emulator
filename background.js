//Incoming Requests
var popupPort;
var contentPort;
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        switch(port.name){
            case "popup->background":
                popupPort = port;
                switch(msg.action){
                    case "keypress":
                        contentPort.postMessage(msg);
                        break;
                    default:
                        port.postMessage(msg);
                }
                break;
            case "content->background":
                contentPort = port;
                port.postMessage(msg);
                break;
            case "simple->background":
                port.postMessage(msg);
                break;
        }
    });
});