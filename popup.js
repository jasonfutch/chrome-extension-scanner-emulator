
var bgPort;

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  bgPort = chrome.runtime.connect({name: "popup->background"});

  //register port with background.js
  bgPort.postMessage({"action":"register"});

  $('#sendScan').click(function(){
    keyPress('98798744',true)
  });

  $('#sendScanUPC').click(function(){
    keyPress('123456789999',true)
  });

  $('#sendSwipe').click(function() {
    keyPress('%B1234123412341234^Carduser/John^030510100000019301000000877000000?;1234123412341234=0305101193010877?')
  });
});

function keyPress(str,bolReturn){
  if(!bolReturn) bolReturn = false;
  bgPort.postMessage({"action":"keypress","value":str,"return":bolReturn});
}
