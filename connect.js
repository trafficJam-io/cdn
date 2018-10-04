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

function onBrowser(message) {

  var data = {
    browser: message.browser,
    event: 'hit',
    location: window.location.href,
    referrer: document.referrer ? document.referrer : null
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
  var url = src.href.replace('/connect.js', '');

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

  trafficjam.postMessage(JSON.stringify(data), '*');
}

document.addEventListener("DOMContentLoaded", function () {
  addTrafficJamIFrame();
  bindEvent(window, 'message', processMessage);
});