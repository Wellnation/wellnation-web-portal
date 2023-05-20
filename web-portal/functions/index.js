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
			// Get the fcmTokens from the ambulance document of patient and ambulance
			const patientToken = newValue.pfcmToken;
			const ambulanceToken = newValue.fcmToken;

			// Send the notification to the recipientToken
			// Implement your notification logic here
			sendNotification(ambulanceToken, patientToken, vehicleNo);
		}

		return null;
	});

function sendNotification(recipientToken, patientToken, vehicleNo) {
	// Implement your notification logic here
	// Use a third-party service or Firebase Cloud Messaging (FCM) to send the notification
	// Example: send a push notification using FCM

	const ambulanceMessage = {
		notification: {
			title: "Patient Booked an Ambulance",
			body:
				"A new ambulance booking has been made for the vehicle number: " +
				vehicleNo,
		},
		token: recipientToken,
	};

	const patientMessage = {
		notification: {
			title: "Ambulance Booked",
			body:
				"Your ambulance booking has been confirmed for the vehicle number: " +
				vehicleNo,
		},
		token: patientToken,
	};

	admin
		.messaging()
		.send(ambulanceMessage)
		.then((response) => {
			console.log("Notification sent successfully:", response);
		})
		.catch((error) => {
			console.error("Error sending notification:", error);
		});

	admin
		.messaging()
		.send(patientMessage)
		.then((response) => {
			console.log("Notification sent successfully:", response);
		})
		.catch((error) => {
			console.error("Error sending notification:", error);
		});
}
