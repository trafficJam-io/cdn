var version = '0.1';
var api = 'v1';

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
    if(typeof window[fnc] !== 'undefined'){
      window[fnc](data);
    }

    VueApp.$store.dispatch('hearMessage', data)
  }catch(e){
    //console.log(e.message);
  }

}

function onBrowser(message) {
  var data = {
    event: 'hit'
  }

  broadcast(data);
  //VueApp.$mount('#app');
}

function onHitResponse(data) {
  VueApp.$mount('#app');
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
  var url = src.href.replace('.js', '.html');

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

function broadcast(data, callback) {

  data.package = 'trafficjam';
  data.version = version;
  data.api =  api;
  data.domain = TRAFFICJAM_DOMAIN;

  data.href = window.location.href;
  data.referrer = document.referrer ? document.referrer : null;

  var url_params = parseGetString();
  for (var attrname in url_params) { data[attrname] = url_params[attrname]; }

  trafficjam.postMessage(JSON.stringify(data), '*');
}

function parseGetString(){
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    url = window.location.href,
    params = {},
    match;
  while(match = regex.exec(url)) {
    params[match[1]] = match[2];
  }

  return params;
}


document.addEventListener('DOMContentLoaded', function() {
  addTrafficJamIFrame();
  bindEvent(window, 'message', processMessage);
});
