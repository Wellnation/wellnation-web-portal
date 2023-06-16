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
import ChatForm from "@/components/ChatForm";
import { Item } from "@/pages/home";

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
	} = useQuery({
		queryKey: ["appointments"],
		queryFn: async () => {
			const q = query(
				collection(db, "appointments"),
				where("drid", "==", user.uid)
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
					doc.status
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
				elevation={0}
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
												{appointment.onlinemode && (
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
