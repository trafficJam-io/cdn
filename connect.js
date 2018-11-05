
var src = new URL(document.currentScript.src);
var trafficjam;

function processMessage(e) {

  try{
    var data = JSON.parse(e.data);
    var fnc = 'on';

    if(data.package != 'trafficjam'){
      return;
    }

    fnc += data.event.charAt(0).toUpperCase() + data.event.slice(1);
    window[fnc](data);

  }catch(e){
    //console.log(e.message);
  }

}

function onPurchaseResponse(message) {
  if(message.status == "success"){
    window.location.href = '/#/success'
  }else{
    alert(message.message);
  }
}

function onEmailResponse(message) {
  if(message.status == "success"){
    window.location.href = '/#/success'
  }
}

function onBrowser(message) {

  var data = {
    event: 'hit'
  }

  broadcast(data);
}

function bindEvent(element, eventName, eventHandler) {
  if(element.addEventListener){
    element.addEventListener(eventName, eventHandler, false);
  }else if(element.attachEvent){
    element.attachEvent('on' + eventName, eventHandler);
  }
}

function addTrafficJamIFrame() {

  var iframe = document.createElement('iframe');
  var url = src.href.replace('/connect.js', '/index.html');

  iframe.src = url;
  iframe.id = 'trafficjam';

  iframe.style.border = 'none';
  iframe.style.position = 'absolute';
  iframe.style.width = '25px';
  iframe.style.height = '25px'
  iframe.style.top = '-50px';

  document.body.appendChild(iframe);

  trafficjam = document.getElementById('trafficjam').contentWindow;
}

function broadcast(data) {
  data.package = 'trafficjam';
  data.version = '0.1';

  data.href = window.location.href;
  data.referrer = document.referrer ? document.referrer : null;


  trafficjam.postMessage(JSON.stringify(data), '*');
}

document.addEventListener("DOMContentLoaded", function () {
  addTrafficJamIFrame();
  bindEvent(window, 'message', processMessage);
});