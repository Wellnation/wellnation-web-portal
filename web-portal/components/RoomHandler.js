import React from "react";
import { db } from "@/lib/firebase.config";
import {
	collection,
	doc as firestoreDoc,
	getDoc,
	query,
	updateDoc,
	where,
	getDocs,
  orderBy,
} from "firebase/firestore";
import { Loader } from "@/components/utils";
import { useQuery } from "react-query";
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
} from "@mui/material";
import Notifications from "./Notifications";
import RoomGenerate from "./RoomGenerate";

const RoomHandler = () => {
	const [notifOpen, setNotifOpen] = React.useState(false);
	const [notifType, setNotifType] = React.useState("success");
	const [notifMessage, setNotifMessage] = React.useState("");
	const [roomType, setRoomType] = React.useState("");
	const [roomCost, setRoomCost] = React.useState(0);
	const [roomBeds, setRoomBeds] = React.useState(0);
	const [roomDescription, setRoomDescription] = React.useState("");
	const [roomTypeSelect, setRoomTypeSelect] = React.useState("");
	const hId = localStorage.getItem("hId");
	const [roomDialogOpen, setRoomDialogOpen] = React.useState(false);
	const [bedsData, setBedsData] = React.useState(null);

	const { data, isLoading, error, refetch } = useQuery(
		["roomTypes"],
		async () => {
			const q = firestoreDoc(db, "users", hId);
			const docSnapshot = await getDoc(q);
			const data = docSnapshot.data();
			const roomTypes = data.roomTypes;
			return roomTypes;
		}
	);

	const handleNotifClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setNotifOpen(false);
	};

	const handleRoomTypeOpen = (type, cost, beds, description) => {
		setRoomDialogOpen(true);
		setRoomType(type);
		setRoomCost(cost);
		setRoomBeds(beds);
		setRoomDescription(description);
	};

	const handleRoomTypeUpdate = async (type) => {
		const roomDoc = firestoreDoc(db, "users", hId);
		const roomDocSnap = await getDoc(roomDoc);
		const roomData = roomDocSnap.data();
		const roomTypes = roomData.roomTypes;
		const roomType = roomTypes.find((room) => room.type === type);
		roomType.cost !== roomCost && (roomType.cost = roomCost);
		roomType.beds !== roomBeds && (roomType.beds = roomBeds);
		roomType.description !== roomDescription &&
			(roomType.description = roomDescription);
		await updateDoc(roomDoc, {
			roomTypes: roomTypes,
		});
		setNotifType("success");
		setNotifMessage("Room type updated successfully!");
		setNotifOpen(true);
		refetch();
	};

	const fetchRooms = (type) => {
		// setRoomTypeSelect(type);
		console.log(type);
		const bedsQuery = query(
			collection(db, `users/${hId}/beds`),
      where("type", "==", String(type)),
      orderBy("roomNo", "asc")
		);
		getDocs(bedsQuery)
			.then((bedsQuerySnapshot) => {
				setBedsData(bedsQuerySnapshot.docs.map((doc) => doc.data()));
			})
			.then(() => console.log(bedsData));
	};

	const handleRoomTypeClose = (e) => {
		setRoomDialogOpen(false);
	};

	if (isLoading) return <Loader />;

	return (
		<div
			style={{
				justifyContent: "center",
				alignItems: "center",
				margin: "50px auto",
			}}
		>
			<div
				style={{
					justifyContent: "space-around",
					alignItems: "center",
					margin: "auto 80px",
				}}
			>
				<Item
					elevation={3}
					style={{
						padding: "10px 30px 50px 30px",
					}}
				>
					<Typography
						variant="h4"
						style={{ fontWeight: "bold", margin: "20px" }}
					>
						Room Types
					</Typography>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: "20px",
						}}
					>
						{data ? (
							data.map((roomType) => {
								return (
									<div key={roomType.type}>
										<Item
											elevation={4}
											style={{
												margin: "10px",
												minWidth: "100px",
												textAlign: "left",
												padding: "20px",
												cursor: "pointer",
											}}
											onClick={() =>
												handleRoomTypeOpen(
													roomType.type,
													roomType.cost,
													roomType.beds,
													roomType.description
												)
											}
										>
											<Typography variant="h4">{roomType.type}</Typography>
											<Typography variant="h6">
												Price: Rs.{roomType.cost}
											</Typography>
											<Typography variant="h6">
												Capacity: {roomType.beds}
											</Typography>
											<Typography variant="inherit">
												<b>Description:</b> {roomType.description}
											</Typography>
										</Item>
									</div>
								);
							})
						) : (
							<h3>No Rooms</h3>
						)}
					</div>
					<div
						style={{
							margin: "50px 10px",
						}}
					>
						<RoomGenerate
							data={data}
							hId={hId}
							notifType={setNotifType}
							notifMsg={setNotifMessage}
							notifOpen={setNotifOpen}
						/>
					</div>
					<div
						style={{
							margin: "30px 10px",
							justifyContent: "center",
						}}
					>
						<Typography
							variant="h4"
							style={{ textAlign: "start", fontWeight: "bold" }}
						>
							Room and Bed Details
						</Typography>
						<Autocomplete
							freeSolo
							disableClearable
							options={data.map((room) => room.type)}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select Room Type"
									margin="normal"
									variant="outlined"
									InputProps={{ ...params.InputProps, type: "search" }}
								/>
							)}
							style={{ width: "300px" }}
							onChange={(e, value) => fetchRooms(value)}
						/>
						{bedsData && bedsData.length > 0 ? (
							<div>
								<Typography variant="h6" style={{ fontWeight: "bold" }}>
									Room Type: {bedsData[0].type}
								</Typography>
								<Typography variant="h6" style={{ fontWeight: "bold" }}>
									Beds Available:{" "}
									{bedsData.filter((bed) => bed.status === true).length}
								</Typography>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    margin: "20px 0px"
									}}
								>
									{bedsData.map((bed) => (
										<Item elevation={4} key={bed.id}>
											<Typography variant="h6">
												<b>Room No:</b> {bed.roomNo}
											</Typography>
											<Typography variant="h6"><b>Bed No:</b> {bed.bedNo}</Typography>
											<Typography variant="h6">
												<b>Status:</b> {bed.status ? "Available" : "Not Available"}
											</Typography>
										</Item>
									))}
								</div>
							</div>
						) : (
							<div>No Data to display.</div>
						)}
					</div>
				</Item>
				<Dialog open={roomDialogOpen} onClose={handleRoomTypeClose} fullWidth>
					<DialogTitle>
						<Typography variant="h3">{roomType}</Typography>
					</DialogTitle>
					<DialogContent style={{ padding: "30px" }}>
						<TextField
							style={{ marginBottom: "20px" }}
							label="Cost"
							variant="outlined"
							fullWidth
							defaultValue={roomCost}
							onChange={(e) => setRoomCost(e.target.value)}
						/>
						<TextField
							style={{ marginBottom: "20px" }}
							label="Beds"
							variant="outlined"
							fullWidth
							defaultValue={roomBeds}
							onChange={(e) => setRoomBeds(e.target.value)}
						/>
						<TextField
							style={{ marginBottom: "20px" }}
							label="Description"
							variant="outlined"
							fullWidth
							defaultValue={roomDescription}
							onChange={(e) => setRoomDescription(e.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => handleRoomTypeUpdate(roomType)}>
							Update
						</Button>
						<Button onClick={handleRoomTypeClose}>Close</Button>
					</DialogActions>
				</Dialog>
				<Notifications
					open={notifOpen}
					handleClose={handleNotifClose}
					type={notifType}
					message={notifMessage}
				/>
			</div>
		</div>
	);
};

export default RoomHandler;
