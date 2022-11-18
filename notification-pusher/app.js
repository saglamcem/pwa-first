const webpush = require("web-push");

console.log(webpush.generateVAPIDKeys());

const publicKey =
  "BC3k0Z_IJLgNmKRYWmB9epv5A67uGxBsvzSQvXlBGUPJlqr_EvNTDoiyGqS-m64Ex2TWwx9xRi7KnPa45OTiToE";
const privateKey = "a7DtFIVtGIJTam3HgyXLjet5KnCenliw7R0VkbzYfIU";

const subscriptionDesktop = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eZPbo6N79Ko:APA91bGQowaTRK7M8jjb02HAqDGWY-MWK-KNiPNJ1OKB9osUJEN8EXctbujJeUxFxQFkyuuAFDt8SNwvcUxzQgNHoMzd-sDlq7GQKrQWHBNQopt41lAD5JaKtfo_hLVlDNZOot89fwqn",
  expirationTime: null,
  keys: {
    p256dh:
      "BFrSabGoONXYKgs1JUUiHeluldhbt7qBmMijF08lpL2YZDkIhT6cb9969THi4vWrNsnPY-Q2WRDVAWthSLlLpow",
    auth: "Q9QMmFhKYDcBh5xvuwtENw",
  },
};

const subscriptionMobile = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dTas-LG74zw:APA91bFoPkORcrlMNW-Q8G45aKWdLXkvUoCH1Z5NGUg5cW6lF45eCuWuFjDGb8LpI3nxmd-cDraCQgLusm_qc0TGbmxb4B9D_vhFNNdp4-iDUcP_dNkKeFIVc8QfG1PtSd87jfvU6VpQ",
  expirationTime: null,
  keys: {
    p256dh:
      "BJMCrT60oFNkSTlQJNtnOEpBmriybUXtirTuUdhMAcqDoRed9EiMlThcdi8rkWJrTUJwqRVUHIXFyVCkLJrKATk",
    auth: "CQJ3OVzaS8LR43fshIPwVw",
  },
};

webpush.setVapidDetails("mailto:cemdevp@gmail.com", publicKey, privateKey);

const payload = {
  notification: {
    data: {
      url: "http://www.youtube.com/@justcemlythings",
    },
    title: "justcemlythings music page",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
  },
};

const subscriptions = [subscriptionDesktop, subscriptionMobile]

subscriptions.forEach(sub => {
    webpush.sendNotification(sub, JSON.stringify(payload));
});
