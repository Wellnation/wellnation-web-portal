import React from "react";
import { Item } from "./home";
import {
	Typography,
	Fab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	InputAdornment,
	IconButton,
	Tooltip,
	Autocomplete,
	Chip,
} from "@mui/material";
import { Add, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import {
	addDoc,
	collection,
	deleteDoc,
	doc as firestoreDoc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import Notifications from "@/components/Notifications";
import { useQuery } from "react-query";
import { Loader } from "@/components/utils";

const Admins = () => {
	const [notifOpen, setNotifOpen] = React.useState(false);
	const [notifMsg, setNotifMsg] = React.useState("");
	const [notifType, setNotifType] = React.useState("success");
	const [adminEmail, setAdminEmail] = React.useState("");
	const [adminPass, setAdminPass] = React.useState("");
	const [adminScopes, setAdminScopes] = React.useState([]);
	const [showPass, setShowPass] = React.useState(false);
	const [adminDomain, setAdminDomain] = React.useState("");
	const [openAdmin, setOpenAdmin] = React.useState(false);
	const [confirmDialog, setConfirmDialog] = React.useState(false);
	const hId = localStorage.getItem("hId");

	const {
		data: adminsData,
		isLoading,
		error,
		refetch,
	} = useQuery(["admins"], async () => {
		const q = collection(db, `users/${hId}/admins`);
		const querySnapshot = await getDocs(q);
		const data = querySnapshot.docs.map((doc) => doc.data());
		return data;
	});

	const handleNotifClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setNotifOpen(false);
	};

	const handleAdminOpen = () => {
		const hospitalDoc = firestoreDoc(db, `users/${hId}`);
		getDoc(hospitalDoc)
			.then((doc) => {
				setAdminDomain(doc.data().domain);
			})
			.then(() => setOpenAdmin(true));
	};

	const handleConfirmClose = () => {
		setConfirmDialog(false);
		setAdminEmail("");
	};

	const handleAdminClose = () => {
		setAdminEmail("");
		setAdminPass("");
		setAdminScopes([]);
		setOpenAdmin(false);
	};

	const handleAddAdmin = async () => {
		if (adminEmail.split("@")[1] !== adminDomain) {
			setNotifMsg(`Admin email domain must be @${adminDomain}`);
			setNotifType("error");
			setNotifOpen(true);
			return;
		}
		const adminCollection = collection(db, `users/${hId}/admins`);
		await addDoc(adminCollection, {
			email: adminEmail,
			password: adminPass,
			scopes: adminScopes,
		})
			.then(() => {
				setNotifMsg("Admin added successfully");
				setNotifType("success");
				setNotifOpen(true);
				setOpenAdmin(false);
				refetch();
				setAdminEmail("");
				setAdminPass("");
				setAdminScopes([]);
			})
			.catch((err) => {
				setNotifMsg(err.message);
				setNotifType("error");
				setNotifOpen(true);
			});
	};

	const handleDeleteAdmin = async () => {
		const q = query(
			collection(db, `users/${hId}/admins`),
			where("email", "==", adminEmail)
		);
		const querySnapshot = await getDocs(q);
		const docId = querySnapshot.docs[0].id;
		const docRef = firestoreDoc(db, `users/${hId}/admins/${docId}`);
		await deleteDoc(docRef);
		refetch();
		setNotifMsg("Admin deleted successfully");
		setNotifType("success");
		setNotifOpen(true);
		setConfirmDialog(false);
		setAdminEmail("");
	};

	if (isLoading) return <Loader />;

	return (
		<Item
			style={{
				margin: "30px 30px",
				padding: "30px 30px",
			}}
		>
			<Typography variant="h4" sx={{ fontWeight: "bold" }}>
				Manage Staff and Admins
			</Typography>
			<div
				style={{
					margin: "20px auto",
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: "bold" }}>
					Admins
				</Typography>
				{adminsData.length > 0 ? (
					adminsData.map((admin) => (
						<div
							key={admin.email}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								margin: "10px 0",
							}}
						>
							<div>
								<Typography
									style={{ margin: "10px auto", fontWeight: "bold" }}
									variant="body1"
								>
									{admin.email}
								</Typography>
								<b>Scopes:</b>{" "}
								{admin.scopes.map((scope) => (
									<Chip
										key={scope}
										label={String(scope)}
										style={{ marginRight: "10px" }}
									/>
								))}
							</div>
							<Tooltip title="Delete Admin">
								<Fab
									size="small"
									color="error"
									onClick={() => {
										setConfirmDialog(true);
										setAdminEmail(admin.email);
									}}
								>
									<Delete />
								</Fab>
							</Tooltip>
						</div>
					))
				) : (
					<Typography variant="body1">No admins added yet</Typography>
				)}
			</div>
			<Dialog open={openAdmin} onClose={handleAdminClose} fullWidth>
				<DialogTitle>Add Admin</DialogTitle>
				<DialogContent>
					<TextField
						style={{ marginTop: "10px" }}
						value={adminEmail}
						type="email"
						label={`Admin email with @${adminDomain} domain`}
						variant="outlined"
						fullWidth
						onChange={(e) => setAdminEmail(e.target.value)}
					/>
					<TextField
						style={{ marginTop: "10px" }}
						value={adminPass}
						type={showPass ? "text" : "password"}
						label="Admin password"
						variant="outlined"
						fullWidth
						onChange={(e) => setAdminPass(e.target.value)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPass(!showPass)}
									>
										{showPass ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Autocomplete
						multiple
						style={{ marginTop: "10px" }}
						id="tags-outlined-admin-scopes"
						options={["beds", "tests"]}
						getOptionLabel={(option) => option}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField
								{...params}
								label="Admin scopes"
								placeholder="Scopes"
							/>
						)}
						onChange={(e, value) => setAdminScopes(value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAddAdmin}>Add</Button>
					<Button onClick={handleAdminClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={confirmDialog}
				onClose={handleConfirmClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Delete Admin?"}</DialogTitle>
				<DialogActions>
					<Button onClick={handleDeleteAdmin} color="error" autoFocus>
						Confirm
					</Button>
					<Button onClick={handleConfirmClose} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<Tooltip title="Add Staff Admins">
				<Fab
					color="primary"
					aria-label="add"
					sx={{
						position: "fixed",
						bottom: "120px",
						right: "20px",
					}}
					onClick={handleAdminOpen}
				>
					<Add />
				</Fab>
			</Tooltip>
			<Notifications
				open={notifOpen}
				handleClose={handleNotifClose}
				message={notifMsg}
				type={notifType}
			/>
		</Item>
	);
};

export default Admins;
