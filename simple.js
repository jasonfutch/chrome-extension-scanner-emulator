function sendDataToExtension(key, value) {
    var dataObj = {"key":key, "value":value};
    var storeEvent = new CustomEvent('myStoreEvent', {"detail":dataObj});
    document.dispatchEvent(storeEvent);
}

// get ready for a reply from the content script
document.addEventListener('fetchResponse', function respListener(event) {
    var data =  event.detail;
    switch(data.action){
        case "keypress":
            sendDataToExtension();
            __triggerKeyboardEvent(document.activeElement,data.value+"",data.return);
            break;
    }
});

function __triggerKeyboardEvent(el, strKey, bolReturn) {
    var aryKey = strKey.split('');
    var lngKey = aryKey.length;
    var key,keyCode;
    for(var i=0;i<lngKey;i++){
        key = aryKey[i];
        keyCode = key.charCodeAt(0);

        sendKeyboardEvent(el, "keydown", keyCode);
        setFormValue(el,key);
        sendKeyboardEvent(el, "keyup", keyCode);
        sendKeyboardEvent(el, "keypress", keyCode);
        sendChangeEvent(el);

        //does character trigger return
        if(key==='?') sendReturnKey(el);
    }
    if(bolReturn){
        sendReturnKey(el)
    }
}

function sendReturnKey(el){
        var key = "";
        var keyCode = 13;
        sendKeyboardEvent(el, "keydown", keyCode);
        sendKeyboardEvent(el, "keyup", keyCode);
        sendKeyboardEvent(el, "keypress", keyCode);
}

var setFormValue = function(el,key){
    var pos = el.selectionStart;
    var posEnd = el.selectionEnd;

    if(typeof el.value !== 'undefined' && typeof el.value.substr !== 'undefined' && key!==''){
        el.value = el.value.substr(0, pos)+key+el.value.substr(posEnd);
        el.selectionStart = pos+1;
        el.selectionEnd = pos+1;
    }
};

var sendKeyboardEvent = function(el, type, keyCode){
    var keyboardEvent = document.createEvent('KeyboardEvents');
    keyboardEvent.initKeyboardEvent(
        type,   //event type
        true,   //bubbles
        false,  //cancelable
        window, //view
        '',     //keyIdentifier
        0,      //keyLocation
        false,  //ctrlKey
        false,  //altKey
        false,  //shiftKey
        false,  //metaKey
        false   //altGraphKey
    );

    // Define event custom values (work around for browser bug)
    var getterCode = {get: function() {return keyCode}};
    var getterChar = {get: function() {return String.fromCharCode(keyCode)}};
    Object.defineProperties(keyboardEvent, {
        charCode: getterCode,
        which: getterCode,
        char: getterChar
    });

    el.dispatchEvent(keyboardEvent);
};

var sendChangeEvent = function(el){
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    el.dispatchEvent(evt);
};