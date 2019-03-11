//キャッシュ名。識別用
var cacheName = "manekineko";

//キャッシュしたいファイルのリストを登録する
var filesToCache = ["index.html", "main.js", "jquery.min.js", "style.css"];

//ブラウザにインストールする
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

//
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

//
self.addEventListener("fetch", function(event) {
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

importScripts("/__/firebase/4.10.0/firebase-app.js");
importScripts("/__/firebase/4.10.0/firebase-messaging.js");
importScripts("/__/firebase/init.js");

var messaging = firebase.messaging();

importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "961587936477"
});

self.addEventListener("push", function(event) {
  //送られたプッシュ通知の本文を表示
  if (Notification.permission == "granted") {
    console.log("Push Notification Recieved", event);
    event.waitUntil(
      self.registration
        .showNotification(event.data.json().notification.title, {
          body: event.data.json().notification.body
        })
        .then(
          function(showEvent) {},
          function(error) {
            console.log(error);
          }
        )
    );
  }
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://watanabe0601.github.io/sw.github.io/02/")
  );
});