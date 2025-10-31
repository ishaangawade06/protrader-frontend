// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC-Vt0JpfAMj9uTdZHXXyot2FvB4lQ_vvE",
  authDomain: "protraderhack-d67f0.firebaseapp.com",
  projectId: "protraderhack-d67f0",
  storageBucket: "protraderhack-d67f0.firebasestorage.app",
  messagingSenderId: "1062485216321",
  appId: "1:1062485216321:web:f34bb52a8acc0a75b24ac0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'ProTraderHack';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(title, options);
});
