// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC-Vt0JpfAMj9uTdZHXXyot2FvB4lQ_vvE",
  authDomain: "protraderhack-d67f0.firebaseapp.com",
  projectId: "protraderhack-d67f0",
  storageBucket: "protraderhack-d67f0.appspot.com",
  messagingSenderId: "1062485216321",
  appId: "1:1062485216321:web:f34bb52a8acc0a75b24ac0"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title || 'ProTraderHack';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
