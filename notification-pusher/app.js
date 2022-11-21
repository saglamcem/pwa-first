try {
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

  const subscriptionCompanyLaptop = {
    "endpoint": "https://wns2-ln2p.notify.windows.com/w/?token=BQYAAAD5f6P2ODiYoZh6F9fFDwWHGPJMptUzHdQ3Wc%2f0PQRcCi5NHwnpfEyrFzo6dNwUeyMq8RXNwMHd1RtJcU1EMCVyLZ4OC4XIGryJwx%2flDwkByT7fQyr%2fp%2fPPtkSn9KJNXbSswjaJCTBKeUVE5rUJ4AhkxsR6PgHDE6Y%2b8uxzgVXzY8RyYZUHNznKR7Tm5wlVDXYHy0hsDQzFRMLuUdlBtrCxVJZjKD%2f9NM%2bQQi2lJIhhCqtL96UmIwonXJDhprizjK80epkwq5y4U242j30sSSPDDwDSwRAusbzuuEvSXDjSigt9a%2fMqI4Gz0oOj4OTiMvf9hf40hPYf0yW88Tjvfz0j",
    "expirationTime": null,
    "keys": {
      "p256dh": "BOkvadi0H2cVsSTxLhD9BFeQxv6xeUiQ71REbR5FaFk_4DyO_6952Y4buWAbfV-D8i55aeb1PhCsZkRB9IXw-LE",
      "auth": "DKVXZBav13476TIFQqQ7uA"
    }
  }

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

  const subscriptions = [subscriptionDesktop, subscriptionMobile, subscriptionCompanyLaptop]

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, JSON.stringify(payload));
  });
}
catch (e) {
  console.error('Something went wrong')
  console.error(e)
}
