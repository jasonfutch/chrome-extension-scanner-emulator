
var bgPort;

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {

  bgPort = chrome.runtime.connect({name: "popup->background"});

  //register port with background.js
  bgPort.postMessage({"action":"register"});

  $('#sendScan').click(function(){
    keyPress('1H0478-R-K-34',true)
  });

  // $('#sendScanUPC').click(function(){
  //   keyPress('123456789999',true)
  // });
  $('#sendScanUPC').click(function(){
    keyPress('073561001991',true)
  });

  $('.sendSwipe').click(function() {
    var val = $(this).attr('value');
    keyPress(val);
    
    // keyPress('%B4111111111111111^Carduser/John^030510100000019301000000877000000?;4003000123456781=15125025432198712345?')
    //keyPress('%B4111111111111111^Carduser/John^1911101100001100000000667000000?;4111111111111111=191110110000667?')
  });
});
<!--cardDetails.cardNumber = '4111111111111111'; cardDetails.month = '05'; cardDetails.year = '20'; cardDetails.csv = '123'; -->
function keyPress(str,bolReturn){
  if(!bolReturn) bolReturn = false;
  bgPort.postMessage({"action":"keypress","value":str,"return":bolReturn});
}
