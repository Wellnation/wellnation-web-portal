importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAj4ZrCjW4dadI3C3NqThB8PoYYEf74B6Q",
  authDomain: "wellnation-cc1b2.firebaseapp.com",
  projectId: "wellnation-cc1b2",
  storageBucket: "wellnation-cc1b2.appspot.com",
  messagingSenderId: "311280251000",
  appId: "1:311280251000:web:7dd143d1dd4d48b0993d8d",
  measurementId: "G-3X5JZR2CW6",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload
	);
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: "/icon.svg",
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});

// }
