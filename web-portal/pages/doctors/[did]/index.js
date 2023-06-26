import React, { useCallback } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	ListItem,
	ListItemText,
	Button,
	TextField,
	IconButton,
	InputAdornment,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Table,
	TableBody,
	TableCell,
	CircularProgress,
	Chip,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAuth } from "@/lib/zustand.config";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSocket } from "@/providers/Socket.provider";
import {
	collection,
	getDocs,
	query,
	where,
	getDoc,
	doc as fireStoreDoc,
	orderBy,
} from "firebase/firestore";
import { Loader } from "@/components/utils";
import { db } from "@/lib/firebase.config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LabelIcon from "@mui/icons-material/Label";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ChatForm from "@/components/ChatForm";
import { Item } from "@/pages/home";
import Link from "next/link";

const patientColumns = [
	{
		id: "tname",
		label: "Test Availed",
		minWidth: 100,
	},
	{
		id: "hospital",
		label: "Hospital",
		minWidth: 100,
	},
	{
		id: "reqtime",
		label: "Requested On",
		minWidth: 150,
		align: "right",
	},
	{
		id: "shldtime",
		label: "Scheduled On",
		minWidth: 150,
		align: "right",
	},
	{
		id: "status",
		label: "Status",
		minWidth: 100,
		align: "right",
	},
	{
		id: "attachment",
		label: "View report",
		minWidth: 100,
		align: "right",
	},
];

const DoctorHome = () => {
	const router = useRouter();
	const { did } = router.query;
	const { socket } = useSocket();
	const { user, loading } = useAuth();
	const [pid, setPid] = React.useState("");
	const [roomId, setRoomId] = React.useState("");
	const [expanded, setExpanded] = React.useState(false);
	const [openDialog, setOpenDialog] = React.useState(false);
	const [patientHist, setPatientHist] = React.useState(null);
	const [histLoading, setHistLoading] = React.useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleCreateRoom = useCallback(() => {
		socket.emit("room:join", { userId: did, roomId });
	}, [socket, did, roomId]);

	const handleRoomJoin = useCallback((data) => {
		const { userId, roomId } = data;
		router.push(`/doctors/${userId}/chat/${roomId}`);
	}, []);

	React.useEffect(() => {
		socket.on("room:join", handleRoomJoin);

		return () => {
			socket.off("room:join", handleRoomJoin);
		};
	}, [socket, handleRoomJoin, setRoomId]);

	const {
		data: appointments,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["appointments"],
		queryFn: async () => {
			const q = query(
				collection(db, "appointments"),
				where("drid", "==", user.uid),
				orderBy("shldtime", "desc")
			);
			const querySnapshot = await getDocs(q);
			const appointmentData = {
				upcoming: [],
				past: [],
			};
			const upcoming = [];
			const past = [];
			await Promise.all(
				querySnapshot.docs.map(async (doc) => {
					const patientDoc = await getDoc(
						fireStoreDoc(db, "publicusers", doc.data().pid)
					);
					doc.data().status
						? past.push({
								id: doc.id,
								patient: patientDoc.data(),
								...doc.data(),
						  })
						: upcoming.push({
								id: doc.id,
								patient: patientDoc.data(),
								...doc.data(),
						  });
				})
			);
			appointmentData.upcoming = upcoming;
			appointmentData.past = past;
			return appointmentData;
		},
		refetchInterval: 5000,
		refetchOnWindowFocus: true,
	});

	const fetchPatientHist = async (id) => {
		setHistLoading(true);
		const patientHistoryCollection = query(
			collection(db, "testHistory"),
			where("patientid", "==", id),
			orderBy("shldtime", "desc")
		);
		const querySnapshot = await getDocs(patientHistoryCollection);
		let patientHistory = [];
		querySnapshot.docs.map((doc) => {
			patientHistory.push({
				id: doc.id,
				...doc.data(),
			});
		});
		setPatientHist(patientHistory);
		setHistLoading(false);
	};

	if (isLoading || loading) {
		return <Loader />;
	}

	if (error) {
		return <div>Something went wrong: {error.message}</div>;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "50px 30px",
			}}
		>
			<Item
				elevation={0}
				style={{
					padding: "20px",
				}}
			>
				<h1>Appointments</h1>
				<h3>Logged in as: {user.displayName}</h3>
				<div>
					{appointments.length === 0 ? (
						<h3>No appointments</h3>
					) : (
						<div>
							<h2>Upcoming appointments</h2>
							{appointments.upcoming.length === 0 ? (
								<h3>No upcoming appointments</h3>
							) : (
								appointments.upcoming.map((appointment, index) => (
									<div key={appointment.id}>
										<Accordion
											expanded={expanded === `panel${index + 1}`}
											onChange={handleChange(`panel${index + 1}`)}
											style={{
												marginBottom: "20px",
												padding: "10px",
											}}
										>
											<AccordionSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls={`panel${index + 1}bh-content`}
												id={`panel${index + 1}bh-header`}
											>
												<Typography sx={{ width: "50%", flexShrink: 0 }}>
													Patient Name: {appointment.patient.name}
												</Typography>
												<Typography sx={{ color: "text.secondary" }}>
													Scheduled Time:{" "}
													{appointment.shldtime.toDate().toLocaleString()}
												</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<Grid container spacing={2}>
													<Grid xs={12} sm={4}>
														<ListItem>
															<ListItemText
																primary="Symptoms"
																secondary={appointment.symptoms}
															/>
														</ListItem>
													</Grid>
													<Grid xs={12} sm={4}>
														<ListItem>
															<ListItemText
																primary="Diagnosis"
																secondary={appointment.remark}
															/>
														</ListItem>
													</Grid>
													<Grid xs={12} sm={4}>
														<ListItem>
															<ListItemText
																primary="Medicines Prescribed"
																secondary={appointment.medicine.map(
																	(medicine) => (
																		<span key={medicine.name}>
																			<span
																				style={{
																					display: "flex",
																					alignItems: "center",
																				}}
																			>
																				<LabelIcon
																					color="primary"
																					style={{ paddingRight: "10px" }}
																				/>{" "}
																				<Typography variant="h6">
																					{medicine.name}
																				</Typography>
																			</span>
																			<span
																				style={{
																					fontWeight: "bold",
																					display: "flex",
																					alignItems: "center",
																				}}
																			>
																				Remark: {medicine.remark}
																			</span>
																		</span>
																	)
																)}
															/>
														</ListItem>
													</Grid>
												</Grid>
												<Button
													style={{
														marginTop: "20px",
													}}
													onClick={() => {
														setOpenDialog(true);
														setPid(appointment.patient.name);
														fetchPatientHist(appointment.pid);
													}}
												>
													See Patient History
												</Button>
												<Dialog
													open={openDialog}
													onClose={() => setOpenDialog(false)}
													fullWidth
													maxWidth={"lg"}
												>
													<DialogTitle>
														<b>Patient History: {pid}</b>
													</DialogTitle>
													<DialogContent>
														{histLoading ? (
															<div
																style={{
																	display: "flex",
																	justifyContent: "center",
																	alignItems: "center",
																}}
															>
																<CircularProgress />
															</div>
														) : (
															<div>
																{patientHist && patientHist.length > 0 ? (
																	<TableContainer>
																		<Table
																			stickyHeader
																			aria-label="collapsible table"
																		>
																			<TableHead>
																				<TableRow>
																					{patientColumns.map((column) => (
																						<TableCell
																							key={column.id}
																							align={column.align}
																							style={{
																								minWidth: column.minWidth,
																							}}
																						>
																							{column.label}
																						</TableCell>
																					))}
																				</TableRow>
																			</TableHead>
																			<TableBody>
																				{patientHist.map((row) => {
																					return (
																						<TableRow
																							key={row.id}
																							sx={{
																								"& > *": {
																									borderBottom: "unset",
																								},
																							}}
																						>
																							<TableCell
																								component="th"
																								scope="row"
																							>
																								{row.tname}
																							</TableCell>
																							<TableCell
																								component="th"
																								scope="row"
																							>
																								{row.hname}
																							</TableCell>
																							<TableCell align="right">
																								{row.reqtime
																									.toDate()
																									.toDateString() +
																									" at " +
																									row.reqtime
																										.toDate()
																										.toLocaleTimeString(
																											"en-us"
																										)}
																							</TableCell>
																							<TableCell align="right">
																								{row.shldtime
																									.toDate()
																									.toDateString() +
																									" at " +
																									row.shldtime
																										.toDate()
																										.toLocaleTimeString(
																											"en-us"
																										)}
																							</TableCell>
																							<TableCell align="right">
																								{row.status &&
																								row.attatchment ? (
																									<Chip
																										label="Completed"
																										color="primary"
																										variant="outlined"
																									/>
																								) : row.status &&
																								  !row.attachment ? (
																									<Chip
																										label="Scheduled"
																										color="primary"
																										variant="outlined"
																									/>
																								) : !row.status ? (
																									<Chip
																										label="Pending"
																										color="primary"
																										variant="outlined"
																									/>
																								) : (
																									<Chip
																										label="Completed"
																										color="primary"
																										variant="outlined"
																									/>
																								)}
																							</TableCell>
																							<TableCell align="center">
																								{row.attachment ? (
																									<Link
																										href={row.attachment}
																										target="_blank"
																									>
																										View Report
																									</Link>
																								) : (
																									<b>No Report</b>
																								)}
																							</TableCell>
																						</TableRow>
																					);
																				})}
																			</TableBody>
																		</Table>
																	</TableContainer>
																) : (
																	<Typography variant="h6" gutterBottom>
																		No history found
																	</Typography>
																)}
															</div>
														)}
													</DialogContent>
													<DialogActions>
														<Button onClick={() => setOpenDialog(false)}>
															Close
														</Button>
													</DialogActions>
												</Dialog>
												{appointment.onlinemode && (
													<div>
														<h3>Video Chat with {appointment.patient.name}</h3>
														<div style={{ marginBottom: "10px" }}>
															<TextField
																style={{ width: "300px" }}
																label="Room ID"
																value={roomId}
																onChange={(e) => setRoomId(e.target.value)}
																InputProps={{
																	endAdornment: (
																		<InputAdornment position="end">
																			<Tooltip title="Generate Random Room ID">
																				<IconButton
																					onClick={() => {
																						let randomRoomId = Math.random()
																							.toString(36)
																							.substring(2, 9);
																						setRoomId(randomRoomId);
																					}}
																				>
																					<AutorenewIcon color="primary" />
																				</IconButton>
																			</Tooltip>
																		</InputAdornment>
																	),
																}}
															/>
														</div>
														<Button
															onClick={() => {
																handleCreateRoom();
															}}
														>
															Start Video Chat
														</Button>
													</div>
												)}
												{!appointment.onlinemode && (
													<ChatForm pid={appointment.pid} />
												)}
											</AccordionDetails>
										</Accordion>
									</div>
								))
							)}
						</div>
					)}
					<h2>Past Appointments</h2>
					{appointments.past.length === 0 ? (
						<h3>No past appointments</h3>
					) : (
						appointments.past.map((appointment, index) => (
							<div key={appointment.id}>
								<Accordion
									expanded={expanded === `panel2${index + 1}`}
									onChange={handleChange(`panel2${index + 1}`)}
									style={{
										marginBottom: "20px",
										padding: "10px",
									}}
								>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls={`panel2${index + 1}bh-content`}
										id={`panel2${index + 1}bh-header`}
									>
										<Typography sx={{ width: "50%", flexShrink: 0 }}>
											Patient Name: {appointment.patient.name}
										</Typography>
										<Typography sx={{ color: "text.secondary" }}>
											Scheduled Time:{" "}
											{appointment.shldtime.toDate().toLocaleString()}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Grid container spacing={2}>
											<Grid xs={12} sm={4}>
												<ListItem>
													<ListItemText
														primary="Symptoms"
														secondary={appointment.symptoms}
													/>
												</ListItem>
											</Grid>
											<Grid xs={12} sm={4}>
												<ListItem>
													<ListItemText
														primary="Diagnosis"
														secondary={appointment.remark}
													/>
												</ListItem>
											</Grid>
											<Grid xs={12} sm={4}>
												<ListItem>
													<ListItemText
														primary="Medicines Prescribed"
														secondary={appointment.medicine.map((medicine) => (
															<span key={medicine.name}>
																<span
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<LabelIcon
																		color="primary"
																		style={{ paddingRight: "10px" }}
																	/>{" "}
																	<Typography variant="h6">
																		{medicine.name}
																	</Typography>
																</span>
																<span
																	style={{
																		fontWeight: "bold",
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	Remark: {medicine.remark}
																</span>
															</span>
														))}
													/>
												</ListItem>
											</Grid>
										</Grid>
									</AccordionDetails>
								</Accordion>
							</div>
						))
					)}
				</div>
			</Item>
		</div>
	);
};

export default DoctorHome;
