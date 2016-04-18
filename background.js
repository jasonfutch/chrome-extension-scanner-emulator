//Incoming Requests
var popupPort = {};
var contentPort = {};

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            var activeTabId = arrayOfTabs[0].id;

            switch(port.name){
                case "popup->background":
                    popupPort[activeTabId] = port;
                    switch(msg.action){
                        case "keypress":
                            contentPort[activeTabId].postMessage(msg);
                            break;
                        default:
                            port.postMessage({"action":"ping","activeTabId":activeTabId});
                    }
                    break;
                case "content->background":
                    contentPort[activeTabId] = port;
                    port.postMessage({"action":"ping","activeTabId":activeTabId});
                    break;
            }
        });
        });
});