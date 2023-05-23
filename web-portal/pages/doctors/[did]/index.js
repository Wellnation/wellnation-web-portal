import React, { useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
	Paper,
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
} from "firebase/firestore";
import { Loader } from "@/components/utils";
import { db } from "@/lib/firebase.config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LabelIcon from "@mui/icons-material/Label";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const DoctorHome = () => {
	const router = useRouter();
	const { did } = router.query;
	const { socket } = useSocket();
	const { user, loading } = useAuth();
	const [roomId, setRoomId] = React.useState("");
	const [expanded, setExpanded] = React.useState(false);

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
	} = useQuery("appointments", async () => {
		const q = query(
			collection(db, "appointments"),
			where("drid", "==", user.uid)
		);
		const querySnapshot = await getDocs(q);
		const appointmentData = [];
		await Promise.all(
			querySnapshot.docs.map(async (doc) => {
				const patientDoc = await getDoc(
					fireStoreDoc(db, "publicusers", doc.data().pid)
				);
				appointmentData.push({
					id: doc.id,
					patient: patientDoc.data(),
					...doc.data(),
				});
			})
		);
		return appointmentData;
	});

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
				elevation={2}
				style={{
					padding: "30px",
				}}
			>
				<h1>Appointments</h1>
				<h3>Logged in as: {user.displayName}</h3>
				<div>
					{appointments.length === 0 ? (
						<h3>No appointments</h3>
					) : (
						appointments.map((appointment) => (
							<div key={appointment.id}>
								<Accordion
									expanded={expanded === "panel1"}
									onChange={handleChange("panel1")}
								>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1bh-content"
										id="panel1bh-header"
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
														primary="Remarks"
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
										<div style={{ marginLeft: "10px" }}>
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
