import React from "react";
import { IconButton, Paper, TextField, Button, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	AddCircleOutlineRounded,
	RemoveCircleOutlineRounded,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useRouter } from "next/router";
import Notifications from "./Notifications";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const ChatForm = ({ pid }) => {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [type, setType] = React.useState("success");
	const [diagnosis, setDiagnosis] = React.useState("");
	const [fields, setFields] = React.useState([
		{
			medicine: "",
			remark: "",
			meds: [
				{
					medTime: "",
					hr: "",
					min: "",
				},
			],
		},
	]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	const handleFormChange = (index, event) => {
		let data = [...fields];
		data[index][event.target.name] = event.target.value;
		setFields(data);
	};

	const handleFormTime = (index, medIndex, value) => {
		let data = [...fields];
		data[index]["meds"][medIndex]["medTime"] = value;
		data[index]["meds"][medIndex]["hr"] = dayjs(value).format("HH");
		data[index]["meds"][medIndex]["min"] = dayjs(value).format("mm");
		setFields(data);
	};

	const handleAddFields = () => {
		setFields([
			...fields,
			{ medicine: "", remark: "", meds: [{ medTime: "", hr: "", min: "" }] },
		]);
	};

	const handleAddMeds = (index) => {
		let data = [...fields];
		data[index]["meds"].push({ medTime: "", hr: "", min: "" });
		setFields(data);
	};

	const handleRemoveMeds = (index, medIndex) => {
		let data = [...fields];
		data[index]["meds"].splice(medIndex, 1);
		setFields(data);
	};

	const handleRemoveField = (index) => {
		const values = [...fields];
		values.splice(index, 1);
		setFields(values);
	};

	//TODO: Appointment schema add roomID? -> Optional

	const handleSubmit = async (event) => {
		event.preventDefault();
		// console.log(fields);
		const appointmentRef = collection(db, "appointments");
		const appointmentSnapshot = query(
			appointmentRef,
			where("drid", "==", router.query.did),
			where("pid", "===", pid)
			// where("pid", "==", "A9FU5zycZ7NldUhJgQbn2rHs6sF3")
		);

		const allDocs = await getDocs(appointmentSnapshot);
		const appointmentDocRef = doc(db, "appointments", allDocs.docs[0].id);

		const medsArray = allDocs.docs[0].data().medicine;
		const newData = fields.map((med) => ({
			name: med.medicine,
			remark: med.remark,
			time: med.meds.map((time) => ({
				hr: time.hr,
				min: time.min,
			})),
		}));
		medsArray.push(newData);

		updateDoc(appointmentDocRef, {
			remark: diagnosis,
			medicine: medsArray,
		})
			.then(() => {
				setOpen(true);
				setType("success");
				setMessage("Diagnosis and Prescription added successfully!");
			})
			.catch((error) => {
				console.log("Error updating document: ", error);
				setOpen(true);
				setType("error");
				setMessage(error.message);
			});
	};

	return (
		<div>
			<Item
				style={{
					margin: "30px auto",
					padding: "30px",
				}}
			>
				<h1>Diagnosis & Prescription Form</h1>
				<h2>Diagnosis</h2>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
					}}
				>
					<TextField
						label="Diagnosis"
						variant="outlined"
						value={diagnosis}
						onChange={(e) => setDiagnosis(e.target.value)}
					/>
				</div>
				<h2>Prescribed Medicines</h2>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "center",
					}}
				>
					{fields.map((input, index) => {
						return (
							<div key={index} style={{ marginTop: "20px" }}>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<TextField
										name="medicine"
										style={{ marginRight: "10px" }}
										label="Medicine"
										variant="outlined"
										value={input.medicine}
										onChange={(event) => handleFormChange(index, event)}
									/>
									<TextField
										name="remark"
										style={{ marginRight: "10px" }}
										label="Remark"
										variant="outlined"
										value={input.remark}
										onChange={(event) => handleFormChange(index, event)}
									/>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
										}}
									>
										{input.meds.map((med, medIndex) => {
											return (
												<div
													key={medIndex}
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														margin: "10px auto",
													}}
												>
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<div style={{ marginRight: "10px" }}>
															<TimePicker
																name="medTime"
																label="Medicine Time"
																ampm={false}
																value={med.medTime}
																onChange={(value) =>
																	handleFormTime(index, medIndex, value)
																}
															/>
														</div>
													</LocalizationProvider>
													<Tooltip title="Add Dosage">
														<IconButton onClick={() => handleAddMeds(index)}>
															<AddCircleOutlineRounded color="secondary" />
														</IconButton>
													</Tooltip>
													{input.meds.length > 1 && (
														<Tooltip title="Remove Dosage">
															<IconButton
																onClick={() =>
																	handleRemoveMeds(index, medIndex)
																}
															>
																<RemoveCircleOutlineRounded color="secondary" />
															</IconButton>
														</Tooltip>
													)}
												</div>
											);
										})}
									</div>
									<Tooltip title="Add Medicine">
										<IconButton onClick={handleAddFields}>
											<AddCircleOutlineRounded color="primary" />
										</IconButton>
									</Tooltip>
									{fields.length > 1 && (
										<Tooltip title="Remove Medicine">
											<IconButton onClick={() => handleRemoveField(index)}>
												<RemoveCircleOutlineRounded color="primary" />
											</IconButton>
										</Tooltip>
									)}
								</div>
							</div>
						);
					})}
				</div>
				<Button
					type="submit"
					variant="text"
					color="primary"
					style={{ marginTop: "20px" }}
					onClick={(e) => handleSubmit(e)}
				>
					Update
				</Button>
			</Item>
			<Notifications
				open={open}
				handleClose={handleClose}
				type={type}
				message={message}
			/>
		</div>
	);
};

export default ChatForm;
