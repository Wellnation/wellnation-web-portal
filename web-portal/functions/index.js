const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.notifyAmbulanceStatusChange = functions
	.region("asia-south1")
	.firestore.document("ambulance/{ambulanceId}")
	.onUpdate((change, context) => {
		const newValue = change.after.data();
		const previousValue = change.before.data();

		if (previousValue.status === true && newValue.status === false) {
			const vehicleNo = newValue.vechilenumber;
			const patientToken = newValue.pfcmToken;
			const ambulanceToken = newValue.fcmToken;

			const ambulanceMessage = {
				notification: {
					title: "Patient Booked an Ambulance",
					body:
						"A new ambulance booking has been made for the vehicle number: " +
						vehicleNo,
				},
				token: ambulanceToken,
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

			sendMessages([ambulanceMessage, patientMessage]);
		}

		return null;
	});

exports.notifyOnEmergency = functions
	.region("asia-south1")
	.firestore.document("emergency/{emergencyId}")
	.onCreate((snapshot, context) => {
		const newValue = snapshot.data();
		const tokens = [];
		const mapUrl = `https://www.google.com/maps/search/?api=1&query=${newValue.location.latitude},${newValue.location.longitude}`;
		admin
			.firestore()
			.doc("publicusers/" + newValue.pid)
			.get()
			.then((doc) => {
				admin
					.firestore()
					.collection("publicusers")
					.where("familyId", "==", doc.data().familyId)
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							tokens.push(doc.data().fcmToken);
						});
					});
			});
		
		admin.firestore().collection("users").get().then((querySnap) => {
			querySnap.forEach((doc) => {
				tokens.push(doc.data().fcmToken);
			});
		})
		
		sendMessages(
			tokens.map((token) => ({
				notification: {
					title: "Emergency Alert!!",
					body: "A family member has raised an emergency. Click here to see the location!",
					click_action: mapUrl,
				},
				token: token,
			}))
		);
	});

const sendMessages = (messages) => {
	messages.forEach((message) => {
		admin
			.messaging()
			.send(message)
			.then((response) => {
				console.log("Notification sent successfully:", response);
			})
			.catch((error) => {
				console.error("Error sending notification:", error);
			});
	});
};

// sendMessages([ambulanceMessage, patientMessage]);
