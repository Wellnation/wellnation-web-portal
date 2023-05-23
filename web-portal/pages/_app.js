import "@/styles/globals.css";
import React from "react";
import Layout from "@/components/Layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import SocketProvider from "@/providers/Socket.provider";
import { useRouter } from "next/router";
import { useLoad } from "@/lib/zustand.config";
import { messaging } from "@/lib/firebase.config";
import { getToken } from "firebase/messaging";
import Notifications from "@/components/Notifications";

export default function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const { setLoad } = useLoad((state) => state);
	const [open, setOpen] = React.useState(false);
	const [type, setType] = React.useState("success");
	const [message, setMessage] = React.useState("");
	const queryClient = new QueryClient();
	const [mode, setMode] = React.useState("light");
	const theme = createTheme({
		palette: {
			mode: mode,
		},
	});

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	const requestPermission = () => {
		try {
			getToken(messaging, {
				vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
			})
				.then((currentToken) => {
					if (currentToken) {
						console.log("Current FCMtoken for client: ", currentToken);
						localStorage.setItem("fcmToken", currentToken);
						// setOpen(true);
						// setType("success");
						// setMessage("Current FCMtoken set for client!");
					} else {
						console.log(
							"No registration token available. Request permission to generate one."
						);
						setOpen(true);
						setType("error");
						setMessage("No registration token available.");
					}
				})
				.catch((err) => {
					console.log("An error occurred while retrieving token. ", err);
				});
			Notification.requestPermission()
				.then((permission) => {
					if (permission === "granted") {
						setOpen(true);
						setType("success");
						setMessage("Notification permission granted.");
					} else {
						setOpen(true);
						setType("error");
						setMessage("Unable to get permission to notify.");
					}
				})
				.catch((error) => {
					console.log("error", error);
				});
		} catch (error) {
			console.log("error", error);
		}
	};

	React.useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/firebase-messaging-sw.js")
				.then(function (registration) {
					console.log("Registration successful, scope is:", registration.scope);
				})
				.catch(function (err) {
					console.log("Service worker registration failed, error:", err);
				});
		}
		if (!router.pathname.includes("patients")) requestPermission();
	}, []);

	React.useEffect(() => {
		if (!router.pathname.includes("patients") && localStorage.getItem("dId")) {
			router.push(`/doctors/${localStorage.getItem("dId")}`);
			setLoad(false);
		} else if (
			!router.pathname.includes("patients") &&
			localStorage.getItem("hId")
		) {
			// router.push("/");
			setLoad(false);
		} else if (router.pathname.includes("patients")) {
			setLoad(false);
		} else {
			setLoad(false);
		}
	}, []);

	return (
		<>
			<Head>
				<title>
					Wellnation -{" "}
					{router.pathname.includes("patients")
						? "Patient Portal"
						: router.pathname.includes("doctors")
						? "Doctor Portal"
						: "Hospital Portal"}
				</title>
				<meta
					name="description"
					content="WellNation is a portal for hospitals to list 
          their services and manage doctor timings and appointments 
          of patients. It also helps hospitals keep a medical record 
          of patients and provide them with personalized care."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<QueryClientProvider client={queryClient}>
					<SocketProvider>
						<Layout>
							<Component {...pageProps} />
							<Notifications
								open={open}
								type={type}
								message={message}
								handleClose={handleClose}
							/>
						</Layout>
					</SocketProvider>
				</QueryClientProvider>
			</ThemeProvider>
		</>
	);
}
