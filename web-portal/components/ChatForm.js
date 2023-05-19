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

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const ChatForm = () => {
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

	//TODO: Add submit function
	//TODO: Prop to pass in patient ID
	//TODO: Fetch did and pid from router query and prop and query db for appointment
	//TODO: Appointment schema add roomID? -> Optional
	//TODO: Pass the medicines object from state to update the appointment schema
	
	// Schema: [
	// 	{
	// 		name: state.name,
	// 		remark: state.remark,
	// 		time: [
	// 			{
	// 				hr: state.meds.hr,
	// 				min: state.meds.min,
	// 			}
	// 		]
	// 	}
	// ]

	const handleSubmit = async (event) => {
		// event.preventDefault();
		console.log(fields);
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
					<TextField label="Diagnosis" variant="outlined" />
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
					variant="text"
					color="primary"
					style={{ marginTop: "20px" }}
					onClick={() => handleSubmit()}
				>
					Update
				</Button>
			</Item>
		</div>
	);
};

export default ChatForm;
