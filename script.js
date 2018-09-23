

function askPermission() {

  navigator.serviceWorker.register('service_worker.js')
    .then(function (registration) {
      Notification.requestPermission(function (user_response) {
        if(user_response == 'granted'){
          subscribeUserToPush(registration);
        }
      }.bind(registration));
    });

}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for(var i = 0; i < rawData.length; ++ i){
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function subscribeUserToPush(registration) {

  var subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array("BJnRev81muJbQ3bEyVPz78LZxefmspQMkcYbv1/feGXsmsEvNAsedNhyxNQ+NYfbIAv7H3jcla7s48KPzJgV6GU=")
  };

  registration.pushManager.subscribe(subscribeOptions)
    .then(function (pushSubscription) {
      sendSubscriptionToBackEnd(pushSubscription);
    });
}

function sendSubscriptionToBackEnd(subscription) {

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST",'/display/push-subscriptions');
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send(JSON.stringify(subscription));

}

