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
	MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useAuth } from "@/lib/zustand.config";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useSocket } from "@/providers/Socket.provider";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loader } from "@/components/utils";
import { db } from "@/lib/firebase.config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
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
	const [videoDevices, setVideoDevices] = React.useState([]);

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
		querySnapshot.docs.map((doc) => {
			appointmentData.push({ id: doc.id, ...doc.data() });
		});
		return appointmentData;
	});

	const getCameraSelection = async () => {
		const devices = await navigator.enumerateDevices();
		const videoDevices = devices.filter(
			(device) => device.kind === "videoinput"
		);
		setVideoDevices(videoDevices);
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
											Patient Name: {appointment.pid}
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
														secondary={appointment.remarks}
													/>
												</ListItem>
											</Grid>
											<Grid xs={12} sm={4}>
												<ListItem>
													<ListItemText
														primary="Medicines Prescribed"
														secondary={appointment.medicine.map((medicine) => (
															<div key={medicine.name}>
																<p
																	style={{
																		fontWeight: "bold",
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<RadioButtonCheckedIcon /> {medicine.name}
																</p>
																<p
																	style={{
																		fontWeight: "bold",
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<RadioButtonCheckedIcon /> {medicine.remark}
																</p>
															</div>
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
			<div style={{ paddingTop: "30px" }}>
				<Item elevation={2} style={{ padding: "30px" }}>
					<h1>Video Chat with Patient</h1>
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
					<Button
						onClick={() => {
							handleCreateRoom();
						}}
					>
						Join Video Chat
					</Button>
					<Button
						variant="text"
						onClick={() => {
							getCameraSelection();
						}}
					>
						Select Camera
					</Button>
					{videoDevices.map((device) => (
						<MenuItem key={device.deviceId} value={device.deviceId}>
							{device.label}
						</MenuItem>
					))}
				</Item>
			</div>
		</div>
	);
};

export default DoctorHome;
