import React, { useCallback } from "react";
import {
	Button,
	IconButton,
	Paper,
	styled,
	TextField,
	InputAdornment,
	Tooltip,
} from "@mui/material";
import { useSocket } from "@/providers/Socket.provider";
import ReactPlayer from "react-player";
import MicIcon from "@mui/icons-material/Mic";
import {
	MicOffRounded,
	Videocam,
	VideocamOff,
	Autorenew,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import peer from "@/service/peer";

// import dynamic from "next/dynamic";
// const peer = dynamic(() => import("@/service/peer"), { ssr: false });

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const PatientChat = () => {
	const router = useRouter();
	const { socket } = useSocket();
	const [room, setRoom] = React.useState("");
	const [mute, setMute] = React.useState(true);
	const [video, setVideo] = React.useState(true);
	const [remoteUID, setRemoteUID] = React.useState("");
	const [myStream, setMyStream] = React.useState(null);
	const [buttonState, setButtonState] = React.useState(true);
	const [remoteStream, setRemoteStream] = React.useState(null);
	const [remoteSocketId, setRemoteSocketId] = React.useState("");

	const pid = router.query.pid;

	const handleCreateRoom = useCallback(() => {
		socket.emit("room:join", { userId: pid, roomId: room });
	}, [socket, pid, room]);

	const handleRoomJoin = useCallback((data) => {
		const { userId, roomId } = data;
		setButtonState(false);
		setRoom(roomId);
		console.log("room joined", data);
	}, []);

	React.useEffect(() => {
		socket.on("room:join", handleRoomJoin);

		return () => {
			socket.off("room:join", handleRoomJoin);
		};
	}, [socket, handleRoomJoin]);

	const handleIncomingCall = useCallback(
		async ({ offer, from, sender }) => {
			console.log("Incoming call", from, "from", sender);
			setRemoteUID(sender);
			setRemoteSocketId(from);
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: true,
				})
				.then((stream) => setMyStream(stream))
				.catch((err) => alert(err));
			const ans = await peer.getAnswer(offer);
			socket.emit("call:accepted", { to: from, ans, sender: pid });
		},
		[socket, remoteUID, remoteSocketId, pid]
	);

	const sendStream = useCallback(() => {
		for (const track of myStream.getTracks()) {
			peer.peer.addTrack(track, myStream);
		}
	}, [myStream]);

	const handleNegotiationNeeded = useCallback(async () => {
		console.log("Negotiation needed");
		const offer = await peer.getOffer();
		socket.emit("peer:nego:needed", { to: remoteSocketId, offer });
	}, [remoteSocketId, socket]);

	React.useEffect(() => {
		peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

		return () => {
			peer.peer.removeEventListener(
				"negotiationneeded",
				handleNegotiationNeeded
			);
		};
	}, [handleNegotiationNeeded]);

	const handleNegotiation = useCallback(
		async ({ from, offer }) => {
			console.log("Negotiation", from, offer);
			const ans = await peer.getAnswer(offer);
			socket.emit("peer:nego:done", { to: from, ans });
		},
		[socket]
	);

	const handleNegotiationFinal = useCallback(async ({ ans }) => {
		console.log("Negotiation final", ans);
		await peer.setLocalDescription(ans);
	}, []);

	React.useEffect(() => {
		peer.peer.addEventListener("track", (event) => {
			const remoteStream = event.streams[0];
			console.log("Got Remote stream", remoteStream);
			setRemoteStream(remoteStream);
		});
	}, [peer]);

	React.useEffect(() => {
		socket.on("incoming:call", handleIncomingCall);
		socket.on("peer:nego:needed", handleNegotiation);
		socket.on("peer:nego:final", handleNegotiationFinal);

		return () => {
			socket.off("incoming:call", handleIncomingCall);
			socket.off("peer:nego:needed", handleNegotiation);
			socket.off("peer:nego:final", handleNegotiationFinal);
		};
	}, [
		socket,
		handleIncomingCall,
		handleNegotiationFinal,
	]);

	return (
		<div>
			<Item
				style={{
					margin: "30px",
					padding: "20px",
				}}
			>
				<h1>Chat with Doctor</h1>
				{buttonState && (
					<>
						<div style={{ marginBottom: "10px" }}>
							<TextField
								style={{ width: "300px" }}
								label="Room ID"
								value={room}
								onChange={(e) => setRoom(e.target.value)}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Tooltip title="Generate Random Room ID">
												<IconButton
													onClick={() => {
														let randomRoomId = Math.random()
															.toString(36)
															.substring(2, 9);
														setRoom(randomRoomId);
													}}
												>
													<Autorenew color="primary" />
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
							Join Video Call
						</Button>
					</>
				)}
				<div>
					{myStream && (
						<Button
							variant="contained"
							color="primary"
							onClick={() => sendStream()}
						>
							Accept Call from {remoteUID}
						</Button>
					)}
					{myStream && (
						<div
							style={{
								margin: "auto",
								marginTop: "20px",
							}}
						>
							<ReactPlayer
								url={myStream}
								playing={video}
								muted={mute}
								width="500px"
							/>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "20px",
									alignItems: "center",
								}}
							>
								<IconButton
									style={{
										marginLeft: "20px",
									}}
									onClick={() => setMute(!mute)}
								>
									{mute ? <MicOffRounded color="error" /> : <MicIcon />}
								</IconButton>
								<IconButton
									style={{
										marginLeft: "20px",
									}}
									onClick={() => setVideo(!video)}
								>
									{video ? <Videocam /> : <VideocamOff color="error" />}
								</IconButton>
							</div>
						</div>
					)}
					{remoteStream && (
						<div
							style={{
								paddingTop: 0,
								marginTop: 0,
								textAlign: "center",
							}}
						>
							<h2>{remoteUID ? remoteUID + " Stream" : ""}</h2>
							<ReactPlayer url={remoteStream} playing muted width="500px" />
						</div>
					)}
				</div>
			</Item>
		</div>
	);
};

export default PatientChat;
