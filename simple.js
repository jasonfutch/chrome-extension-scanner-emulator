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
    var key;
    for(var i=0;i<lngKey;i++){
        key = aryKey[i];
        keyCode = key.charCodeAt(0);

        sendKeyboardEvent(el, "keydown", keyCode, key);
        setFormValue(el,key);
        sendKeyboardEvent(el, "keyup", keyCode, key);
        sendKeyboardEvent(el, "keypress", keyCode, key);
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
        sendKeyboardEvent(el, "keydown", keyCode, key);
        sendKeyboardEvent(el, "keyup", keyCode, key);
        sendKeyboardEvent(el, "keypress", keyCode, key);
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

var removeFormValue = function(el,key){
    var pos = el.selectionStart;
    var posEnd = el.selectionEnd;

    if(typeof el.value !== 'undefined' && typeof el.value.substr !== 'undefined' && key!==''){
        el.value = el.value.substr(0, pos-1)+el.value.substr(posEnd);
        el.selectionStart = pos-1;
        el.selectionEnd = pos-1;
    }
};

var sendKeyboardEvent = function(el, type, keyCode, key){
    var keyboardEvent = document.createEvent('KeyboardEvents');
    keyboardEvent.initKeyboardEvent(
        type,   //event type
        true,   //bubbles
        true,  //cancelable
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
    var getterCode = {value: keyCode};
    var getterChar = {value: String.fromCharCode(keyCode)};
    Object.defineProperties(keyboardEvent, {
        charCode: getterCode,
        keyCode: getterCode,
        which: getterCode,
        char: getterChar,
        source: {value: 'emulator'}
    });

    //extending preventDefault function remove value changes from our form field hack
    keyboardEvent.preventDefault = (function(_super) {
        // return extended new `preventDefault()` function
        return function() {
            removeFormValue(el, key);

            // Pass control back to the original preventDefault()
            // by using .apply on `_super`
            return _super.apply(this, arguments);
        };

    })(keyboardEvent.preventDefault);


    el.dispatchEvent(keyboardEvent);
};

var sendChangeEvent = function(el){
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    el.dispatchEvent(evt);
};