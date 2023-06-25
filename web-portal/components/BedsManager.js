import { Item } from "@/pages/home";
import { Chip, Divider, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import {
	collection,
	doc as firestoreDoc,
	getDoc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Loader } from "./utils";

const BedsManager = () => {
	const [hospitalName, setHospitalName] = React.useState("");
	const hId = localStorage.getItem("hId");
	const {
		data: bedsData,
		isLoading,
		error,
	} = useQuery(
		["beds", hId],
		async () => {
			const bedsArr = [];
			const hospitalDoc = firestoreDoc(db, "users", hId);
			const hospitalSnap = await getDoc(hospitalDoc);
			setHospitalName(hospitalSnap.data().name);
			const bedsCol = await getDocs(
				query(collection(db, `users/${hId}/beds`), orderBy("roomNo"))
      );
			await Promise.all(
				bedsCol.docs.map(async (doc) => {
					const type = hospitalSnap
						.data()
						.roomTypes.filter((room) => room.type === doc.data().type);
					if (doc.data().pid !== "") {
						const patientDoc = firestoreDoc(db, "publicusers", doc.data().pid);
						const patientSnap = await getDoc(patientDoc);
						bedsArr.push({
							id: doc.id,
							bedType: type,
							...doc.data(),
							patientName: patientSnap.data().name,
							patientContact: patientSnap.data().phone,
						});
					} else {
						bedsArr.push({
							id: doc.id,
							bedType: type,
							...doc.data(),
						});
					}
				})
			);
			return bedsArr;
		},
		{
			refetchInterval: 1000,
			refetchOnWindowFocus: true,
		}
	);

	if (isLoading) return <Loader />;

	return (
		<div
			style={{
				margin: "auto",
			}}
		>
			<Typography variant="h4" style={{ fontWeight: "bold" }}>
				{hospitalName}
			</Typography>
			<Typography variant="h6" style={{ fontWeight: "bold" }}>
				Beds & Rooms Management
			</Typography>
			<div
				style={{
					margin: "20px auto",
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gridGap: "40px",
				}}
			>
				{bedsData.map((bed) => (
					<Item
						elevation={3}
						key={bed.id}
						style={{
							padding: "30px 20px",
							display: "flex",
							flexDirection: "column",
              minHeight: "300px",
              cursor: "pointer"
            }}
            onClick={() => {
              window.location.href = window.origin + `/${hId}/${bed.id}`
            }}
					>
						<Typography
							variant="h4"
							style={{ fontWeight: "bold", marginBottom: "5px" }}
						>
							Room No: {bed.roomNo}
						</Typography>
						<Typography
							variant="h5"
							style={{ fontWeight: "bold", marginBottom: "5px" }}
						>
							Bed No: {bed.bedNo}
						</Typography>
						<Typography variant="h6" style={{ marginBottom: "5px" }}>
							Bed Type: <b>{bed.type}</b>
						</Typography>
						<Typography variant="h6" style={{ marginBottom: "5px" }}>
							Bed Cost: <b>Rs.{bed.bedType[0].cost}</b>
						</Typography>
						<Typography
							variant="h6"
							style={{ fontWeight: "bold", marginBottom: "5px" }}
						>
							{bed.status ? (
								<Chip label="Vacant" color="success" />
							) : (
								<Chip label="Occupied" color="error" />
							)}
						</Typography>
						{!bed.status && (
							<>
								<Divider variant="inset" style={{ color: "black" }} />
								<Typography
									variant="h6"
									style={{ fontWeight: "bold", margin: "5px 0px" }}
								>
									Patient Name: {bed.patientName}
								</Typography>
								<Typography
									variant="h6"
									style={{ fontWeight: "bold" }}
								>
									Contact: {bed.patientContact}
								</Typography>
							</>
						)}
					</Item>
				))}
			</div>
		</div>
	);
};

export default BedsManager;
