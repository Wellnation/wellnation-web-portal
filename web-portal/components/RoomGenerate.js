import { db } from "@/lib/firebase.config";
import { Select, Typography, MenuItem, TextField, Button } from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore";
import React from "react";

const RoomGenerate = ({ data, hId, notifType, notifMsg, notifOpen }) => {
	const [beds, setBeds] = React.useState(0);
	const [rooms, setRooms] = React.useState(0);
	const [roomType, setRoomType] = React.useState("");
  const [startingRoomNumber, setStartingRoomNumber] = React.useState(0);
  
  const handleCreateBeds = async () => {
    let startingRoom = startingRoomNumber;
    for (let i = 0; i < rooms; i++) {
      for (let j = 0; j < beds; j++) {
        const roomDocRef = doc(collection(db, `users/${hId}/beds`))
        await setDoc(roomDocRef, {
          bedNo: j + 1,
          pid: "",
          roomNo: startingRoom,
          status: true,
          type: roomType,
          id: roomDocRef.id,
        });
        console.log("document:", roomDocRef.id, "created for room:", startingRoom, "bed:", j + 1);
      }
      startingRoom++;
    }
    notifType("success");
    notifMsg("Beds created successfully!");
    notifOpen(true);
  };

	return (
		<div>
			<Typography variant="h4" style={{ fontWeight: "bold" }}>
				Room and Bed Management
			</Typography>
			<div
				style={{
					display: "flex",
					justifyContent: "start",
					alignItems: "center",
				}}
			>
				<Typography variant="h5" style={{ fontWeight: "bold" }}>
					Room Type:
				</Typography>
				<Select
					value={roomType}
					style={{
						margin: "20px 20px",
						width: "300px",
					}}
					onChange={(e) => {
						setRoomType(e.target.value);
						setBeds(data.find((room) => room.type === e.target.value).beds);
					}}
				>
					{data.map((room) => {
						return <MenuItem value={room.type}>{room.type}</MenuItem>;
					})}
				</Select>
			</div>
			<div
				style={{
					margin: "20px auto",
					display: "flex",
					justifyContent: "start",
					alignItems: "center",
				}}
			>
				<Typography variant="h5" style={{ fontWeight: "bold" }}>
					Number of Rooms:
				</Typography>
				<TextField
					type="number"
					value={rooms}
					onChange={(e) => setRooms(e.target.value)}
					style={{
						margin: "0px 20px",
						width: "200px",
					}}
				/>
			</div>
			<div
				style={{
					margin: "20px auto",
					display: "flex",
					justifyContent: "start",
					alignItems: "center",
				}}
			>
				<Typography variant="h5" style={{ fontWeight: "bold" }}>
					Starting Room Number:
				</Typography>
				<TextField
					type="number"
					value={startingRoomNumber}
					onChange={(e) => setStartingRoomNumber(e.target.value)}
					style={{
						margin: "0px 20px",
						width: "200px",
					}}
				/>
			</div>
			<div>
				<Button
					variant="contained"
					color="primary"
          style={{ margin: "20px 0px" }}
          onClick={handleCreateBeds}
				>
					Generate Beds
				</Button>
			</div>
		</div>
	);
};

export default RoomGenerate;
