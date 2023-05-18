import React from "react";
import { db } from "@/lib/firebase.config";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "@/lib/zustand.config";
import { Loader, NotUser } from "@/components/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DataUpdate from "@/components/DataUpdate";
import Appointments from "@/components/Appointments";
import { useQuery } from "react-query";
import {
	collection,
	getDocs,
	where,
	query,
	getDoc,
	doc as firestoreDoc,
	setDoc,
} from "firebase/firestore";
import {
	ListItem,
	ListItemText,
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Paper,
	TablePagination,
	Dialog,
	DialogTitle,
	Fab,
	TextField,
	Button,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Notifications from "@/components/Notifications";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const columns = [
	{
		field: "id",
		headerName: "ID",
		width: 90,
	},
	{
		field: "patient",
		headerName: "Patient Name",
		type: "string",
		width: 150,
	},
	{
		field: "doctorName",
		headerName: "Doctor Name",
		type: "string",
		width: 150,
	},
	{
		field: "hospitalName",
		headerName: "Hospital Name",
		type: "string",
		width: 110,
	},
	{
		field: "cause",
		headerName: "Cause",
		type: "string",
		width: 110,
	},
	{
		field: "time",
		headerName: "Date",
		type: "date",
		width: 110,
		valueGetter: (params) => {
			return params.row.time.toDate();
		},
	},
	{
		field: "completed",
		headerName: "Status",
		type: "boolean",
		width: 110,
		// editable: true,
	},
];

const Home = () => {
	const { user, loading, userError } = useAuth();
	const [appointmentData, setAppointmentData] = React.useState([]);
	const [auth, setAuth] = React.useState(true);
	const [openTest, setOpenTest] = React.useState(false);

	const hId = localStorage.getItem("hId");
	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ["camps"],
		queryFn: fetchtests,
	});

	async function fetchtests() {
		const camps = await getDocs(
			query(collection(db, "campaign"), where("hid", "==", hId))
		);
		return camps;
	}

	if (!auth) return <NotUser />;
	else if (isLoading) return <Loader />;
	else if (error) {
		return (
			<div>
				An error occurred: {error.message}
				<br />
				{user.email}
			</div>
		);
	}

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingTop: "50px",
					fontWeight: 900,
					fontSize: "1.5rem",
				}}
			>
				Approve Appointments
			</div>
			<Appointments />
			<Item
				elevation={2}
        style={{
          margin: "20px 60px",
					padding: "30px",
				}}
			>
				<h3>Ongoing Blood Donation Campaigns</h3>
				{!data.docs ? (
					<h3>No Camps yet</h3>
				) : (
					data.docs.map((tests) => (
						<>
							<ListItem
								key={tests.data().cid}
								secondaryAction={
									<>
										<IconButton>
											<EditIcon style={{ marginRight: "20px" }} />
										</IconButton>
										<IconButton>
											<DeleteIcon />
										</IconButton>
									</>
								}
							>
								<ListItemText
									primary={
										<Typography variant="h5">{tests.data().name}</Typography>
									}
									secondary={
										<>
											<table>
												<tr>
													<th>Camp starts on: </th>
													<td>
														{tests.data().start.toDate().toDateString() +
															" at " +
															tests
																.data()
																.start.toDate()
																.toLocaleTimeString("en-us")}
													</td>
												</tr>
												<tr>
													<th>Camp ends on: </th>
													<td>
														{tests.data().end.toDate().toDateString() +
															" at " +
															tests
																.data()
																.end.toDate()
																.toLocaleTimeString("en-us")}
													</td>
												</tr>
											</table>
										</>
									}
								/>
							</ListItem>
						</>
					))
				)}
			</Item>
			<DataUpdate />
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: "fixed",
					bottom: "120px",
					right: "20px",
				}}
				onClick={() => setOpenTest(true)}
			>
				<BloodtypeIcon />
			</Fab>
			<AddTestDialog
				open={openTest}
				onClose={() => setOpenTest(false)}
				func={refetch}
			/>
		</>
	);
};

const AddTestDialog = (props) => {
	const { onClose, selectedValue, open, func } = props;
	const [testName, setTestName] = React.useState("");
	const [openNotif, setOpenNotif] = React.useState(false);
	const [type, setType] = React.useState("error");
	const [start, setStart] = React.useState(dayjs());
	const [end, setEnd] = React.useState(dayjs());
	const [message, setMessage] = React.useState("");

	const handleCloseNotif = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenNotif(false);
	};

	const handleClose = () => {
		setTestName("");
		onClose(selectedValue);
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		try {
			const hospitalId = localStorage.getItem("hId");
			const hosp = await getDoc(firestoreDoc(db, "users", hospitalId));
			const colRef = collection(db, "campaign");
			const newid = firestoreDoc(colRef).id;
			await setDoc(firestoreDoc(db, "campaign", newid), {
				hid: hospitalId,
				name: testName,
				start: start.toDate(),
				end: end.toDate(),
				hospitalname: hosp.data().name,
				location: hosp.data().location,
				cid: newid,
			});

			setType("success");
			setMessage("Test Added Successfully");
			setOpenNotif(true);
			setTestName("");
			func();
			setTimeout(() => {
				setOpenNotif(false);
				onClose(selectedValue);
			}, 2000);
		} catch (error) {
			console.log(error);
			setType("error");
			setMessage(error.message);
			setOpenNotif(true);
		}
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Add new Blood donation campaign</DialogTitle>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					padding: "20px",
					width: "500px",
				}}
			>
				<TextField
					id="outlined-basic"
					label="Campaiign name"
					variant="outlined"
					value={testName}
					onChange={(e) => {
						setTestName(e.target.value);
					}}
				/>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateTimePicker
						label="Start Time"
						value={start}
						onChange={(newValue) => {
							setStart(newValue);
						}}
					/>
					<DateTimePicker
						label="End Time"
						value={end}
						onChange={(newValue) => {
							setEnd(newValue);
						}}
					/>
				</LocalizationProvider>
				<div
					style={{
						display: "flex",
						justifyContent: "space-evenly",
						gap: "10px",
					}}
				>
					<Button
						variant="text"
						onClick={(e) => handleUpload(e)}
						startIcon={<CloudUploadIcon />}
					>
						Add Campaign
					</Button>
					<Button
						variant="text"
						onClick={handleClose}
						startIcon={<CancelIcon />}
					>
						Cancel
					</Button>
				</div>
			</div>
			<Notifications
				type={type}
				message={message}
				open={openNotif}
				handleClose={handleCloseNotif}
			/>
		</Dialog>
	);
};

export default Home;
