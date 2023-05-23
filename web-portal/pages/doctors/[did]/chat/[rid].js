import React, { useCallback } from "react";
import { Button, IconButton, Paper, styled } from "@mui/material";
import peer from "@/service/peer";
import { useSocket } from "@/providers/Socket.provider";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import MicIcon from "@mui/icons-material/Mic";
import { MicOffRounded, Videocam, VideocamOff } from "@mui/icons-material";
import ChatForm from "@/components/ChatForm";

// import dynamic from "next/dynamic";
// const peer = dynamic(() => import("@/service/peer"), { ssr: false });

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const VideoRoom = () => {
	const router = useRouter();
	const { socket } = useSocket();
	const roomId = router.query.rid;
	const [mute, setMute] = React.useState(true);
	const [video, setVideo] = React.useState(true);
	const [myStream, setMyStream] = React.useState(null);
	const [remoteUID, setRemoteUID] = React.useState("");
	const [remoteStream, setRemoteStream] = React.useState(null);
	const [remoteSocketId, setRemoteSocketId] = React.useState("");

	const handleUserJoined = useCallback(
		({ userId, id }) => {
			console.log("user joined", userId);
			setRemoteUID(userId);
			setRemoteSocketId(id);
		},
		[setRemoteUID, setRemoteSocketId]
	);

	const handleCallUser = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		const offer = await peer.getOffer();
		socket.emit("user:call", { to: remoteSocketId, offer });
		setMyStream(stream);
	}, [remoteSocketId, socket]);

	const handleIncomingCall = useCallback(
		async ({ offer, from }) => {
			console.log("Incoming call", from, offer);
			setRemoteSocketId(from);
			peer.getAnswer(offer)
				.then(() => {
					navigator.mediaDevices
						.getUserMedia({
							video: true,
							audio: true,
						})
						.then((stream) => setMyStream(stream))
						.catch((err) => alert(err));
				})
				.then((ans) => {
					socket.emit("call:accepted", { to: from, ans });
				})
				.catch((err) => alert(err));
		},
		[socket]
	);

	const handleCallAccepted = useCallback(
		async ({ from, ans }) => {
			console.log("Call accepted from", from);
			peer.setLocalDescription(ans)
				.then(() => {
					navigator.mediaDevices
						.getUserMedia({
							video: true,
							audio: true,
						})
						.then((stream) => {
							const tracks = stream.getTracks();
							tracks.forEach((track) =>
								peer.peer.addTrack(track, stream)
							);
						})
						.catch((err) => alert(err));
				})
				.catch((err) => alert(err));
			
			// if (myStream) {
			// 	// for (const track of myStream.getTracks()) {
			// 	// 	peer.peer.addTrack(track, myStream);
			// 	// };
			// 	const tracks = myStream.getTracks();
			// 	tracks.forEach((track) => peer.peer.addTrack(track, myStream));
			// } else {
			// 	alert("No stream");
			// 	console.log(peer.peer);
			// }
		},
		[myStream]
	);

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

	const handleEndCall = useCallback(() => {
		socket.emit("leave");
	}, []);

	const handleLeaveRoom = useCallback((data) => {
		const { from } = data;
		socket.disconnect();
		peer.peer.close();
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true,
			})
			.then((stream) => {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
			})
			.catch((err) => alert(err));
		router.push(`/${router.query.did}`);
	}, []);

	React.useEffect(() => {
		peer.peer.addEventListener("track", (event) => {
			const remoteStream = event.streams;
			console.log("Got Remote stream", remoteStream);
			setRemoteStream(remoteStream[0]);
		});
	}, [peer]);

	React.useEffect(() => {
		socket.on("user:joined", handleUserJoined);
		socket.on("incoming:call", handleIncomingCall);
		socket.on("call:accepted", handleCallAccepted);
		socket.on("peer:nego:needed", handleNegotiation);
		socket.on("peer:nego:final", handleNegotiationFinal);
		socket.on("room:leave", handleLeaveRoom);

		return () => {
			socket.off("user:joined", handleUserJoined);
			socket.off("incoming:call", handleIncomingCall);
			socket.off("call:accepted", handleCallAccepted);
			socket.off("peer:nego:needed", handleNegotiation);
			socket.off("peer:nego:final", handleNegotiationFinal);
			socket.off("room:leave", handleLeaveRoom);
		};
	}, [
		socket,
		handleUserJoined,
		handleIncomingCall,
		handleCallAccepted,
		handleNegotiation,
		handleNegotiationFinal,
		handleLeaveRoom,
	]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "50px 30px",
				textAlign: "center",
			}}
		>
			<h1>Video Room</h1>
			<Item
				elevation={2}
				style={{
					justifyContent: "center",
					display: "flex",
					alignItems: "flex-start",
					padding: "30px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
					}}
				>
					{remoteSocketId ? (
						<div>
							<h4>{remoteUID} connected to Room</h4>
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleCallUser()}
							>
								Call {remoteUID}
							</Button>
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
									<ReactPlayer url={remoteStream} playing width="500px" />
								</div>
							)}
							<ChatForm pid={remoteUID} />
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "20px",
									alignItems: "center",
								}}
							>
								<Button
									variant="contained"
									color="secondary"
									onClick={() => {
										handleEndCall();
									}}
								>
									Leave Room
								</Button>
							</div>
						</div>
					) : (
						<h4>Waiting for user to join...</h4>
					)}
				</div>
			</Item>
		</div>
	);
};

export default VideoRoom;
