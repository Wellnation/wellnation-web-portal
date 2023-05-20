const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.notifyAmbulanceStatusChange = functions
	.region("asia-south1")
	.firestore.document("ambulance/{ambulanceId}")
	.onUpdate((change, context) => {
		const newValue = change.after.data();
		const previousValue = change.before.data();

		// Check if the status parameter changed from true to false
		if (previousValue.status === true && newValue.status === false) {
			const vehicleNo = newValue.vechilenumber;

			// Get the recipientToken from the ambulance document
			const recipientToken = newValue.fcmToken;

			// Send the notification to the recipientToken
			// Implement your notification logic here
			sendNotification(recipientToken, vehicleNo);
		}

		return null;
	});

function sendNotification(recipientToken, vehicleNo) {
	// Implement your notification logic here
	// Use a third-party service or Firebase Cloud Messaging (FCM) to send the notification
	// Example: send a push notification using FCM

	const message = {
		notification: {
			title: "Patient Booked an Ambulance",
			body: "A new ambulance booking has been made for the vehicle number: " + vehicleNo,
		},
		token: recipientToken,
	};

	admin
		.messaging()
		.send(message)
		.then((response) => {
			console.log("Notification sent successfully:", response);
		})
		.catch((error) => {
			console.error("Error sending notification:", error);
		});
}
