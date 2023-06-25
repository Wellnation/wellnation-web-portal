import React from "react";
import {
	Avatar,
	Button,
	TextField,
	Box,
	Typography,
	Container,
} from "@mui/material";
import Notifications from "@/components/Notifications";
import { SupervisorAccount } from "@mui/icons-material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase.config";

const AdminLogin = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [type, setType] = React.useState("error");
	const [hId, setHId] = React.useState("");
	const [domain, setDomain] = React.useState("");

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const hospitalQuery = query(
			collection(db, "users"),
			where("domain", "==", email.split("@")[1])
		);
		getDocs(hospitalQuery)
			.then((hospitalSnapshot) => {
				if (hospitalSnapshot.empty) {
					setType("error");
					setErrorMessage("Hospital not found. Please check email domain");
					setOpen(true);
					return;
				}
				setHId(hospitalSnapshot.docs[0].id);
				setDomain(hospitalSnapshot.docs[0].data().domain);
			})
			.then(() => {
				const adminDoc = query(
					collection(db, `users/${hId}/admins`),
					where("email", "==", email)
				);
				getDocs(adminDoc)
					.then((adminSnapshot) => {
						if (adminSnapshot.empty) {
							setType("error");
							setErrorMessage("Admin not found. Please check email");
							setOpen(true);
							return;
						}
						if (adminSnapshot.docs[0].data().password !== password) {
							setType("error");
							setErrorMessage("Incorrect password");
							setOpen(true);
							return;
						}
						localStorage.setItem("hId", hId);
						localStorage.setItem("aId", adminSnapshot.docs[0].id);
						localStorage.setItem("scopes", adminSnapshot.docs[0].data().scopes);
					})
					.then(() => {
						window.location.href = window.location.origin;
					});
			})
			.catch((error) => {
				setType("error");
				setErrorMessage(error.message);
				setOpen(true);
			});
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
					<SupervisorAccount />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Notifications
						open={open}
						type={type}
						message={errorMessage}
						handleClose={handleClose}
					/>
				</Box>
			</Box>
		</Container>
	);
};

export default AdminLogin;
