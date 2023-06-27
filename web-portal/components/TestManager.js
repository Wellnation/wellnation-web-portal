import React from "react";
import { Item } from "@/pages/home";
import {
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Autocomplete,
	Divider,
} from "@mui/material";
import Notifications from "./Notifications";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";

const TestManager = ({ data }) => {
	const [open, setOpen] = React.useState(false);
	const [testname, setTestname] = React.useState("");
	const [testprice, setTestprice] = React.useState("");
	const [type, setType] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [testId, setTestId] = React.useState("");
	const [notification, setNotification] = React.useState({
		open: false,
		message: "",
		type: "",
	});

	const handleTestOpen = (testname, testprice, type, description, testId) => {
		setTestname(testname);
		setTestprice(testprice);
		setType(type);
		setDescription(description);
		setTestId(testId);
		setOpen(true);
	};

	const handleTestClose = () => {
		setOpen(false);
		setTestname("");
		setTestprice("");
		setType("");
		setDescription("");
	};

	const handleTestUpdate = async () => {
		if (testname === "" || testprice === "" || type === "") {
			setNotification({
				open: true,
				message: "Please fill all the fields",
				type: "error",
			});
			return;
		}
		const testDoc = doc(db, "tests", testId);
		await updateDoc(testDoc, {
			testname: testname,
			testprice: testprice,
			type: type.toLowerCase(),
			description: description,
		})
			.then(() => {
				setNotification({
					open: true,
					message: "Test updated successfully",
					type: "success",
				});
			})
			.then(() => handleTestClose());
	};

	return (
		<div>
			<Item
				elevation={2}
				style={{
					padding: "30px",
					margin: "10px 50px",
				}}
			>
				<Typography
					variant="h4"
					style={{ fontWeight: "bold", marginBottom: "20px" }}
				>
					Available Tests and Packages
				</Typography>
				{!data.alltests || data.alltests.length === 0 ? (
					<Typography variant="h5" style={{ margin: "20px auto" }}>
						No tests available
					</Typography>
				) : (
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: "20px",
							margin: "20px 0px",
						}}
					>
						{data.alltests.map((tests) => (
							<Item
								key={tests.id}
								elevation={4}
								style={{
									margin: "10px",
									minWidth: "150px",
									textAlign: "left",
									padding: "20px",
									cursor: "pointer",
									display: "flex",
									flexDirection: "column",
									minHeight: "250px",
								}}
								onClick={() =>
									handleTestOpen(
										tests.data().testname,
										tests.data().testprice,
										tests.data().type,
										tests.data().description,
										tests.id
									)
								}
							>
								<div>
									<Typography variant="h5" style={{ fontWeight: "bold" }}>
										{tests.data().testname}
									</Typography>
									<Typography variant="h6" style={{ fontWeight: "bold" }}>
										Type: {tests.data().type.toUpperCase()}
									</Typography>
									<Typography variant="body1">
										{tests.data().description
											? tests.data().description.length > 70 ?
												tests.data().description.substring(0, 70) + "..." : tests.data().description
											: "No description provided"}
									</Typography>
								</div>
								<div
									style={{
										marginTop: "auto",
									}}
								>
									<Divider />
									<Typography
										variant="h5"
										style={{ fontWeight: "bold", marginTop: "10px" }}
									>
										Price: ₹{tests.data().testprice}
									</Typography>
								</div>
							</Item>
						))}
					</div>
				)}
			</Item>
			<Dialog open={open} onClose={handleTestClose}>
				<DialogTitle>Test Details</DialogTitle>
				<DialogContent>
					<TextField
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Test Name"
						variant="outlined"
						value={testname}
						onChange={(e) => {
							setTestname(e.target.value);
						}}
					/>
					<TextField
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Test price"
						variant="outlined"
						value={testprice}
						onChange={(e) => {
							setTestprice(e.target.value);
						}}
					/>
					<Autocomplete
						style={{ marginTop: "10px" }}
						freeSolo
						disableClearable
						value={type}
						options={["test", "package"]}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Type"
								variant="outlined"
								value={type}
								InputProps={{ ...params.InputProps, type: "search" }}
							/>
						)}
						onChange={(e, value) => setType(value)}
					/>
					<TextField
						multiline
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Test Description"
						variant="outlined"
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleTestUpdate}>Save</Button>
					<Button onClick={handleTestClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<Notifications
				open={notification.open}
				message={notification.message}
				type={notification.type}
				handleClose={(e, reason) => {
					if (reason === "clickaway") {
						return;
					}
					setNotification({ ...notification, open: false });
				}}
			/>
		</div>
	);
};

export default TestManager;
