import React from "react";
import { IconButton, Paper, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AddCircleOutlineRounded, RemoveCircleOutlineRounded } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
		{ medicine: "", dosage: "", startTime: dayjs(), endTime: dayjs() },
	]);

	const handleFormChange = (index, event) => {
		let data = [...fields];
		data[index][event.target.name] = event.target.value;
		setFields(data);
	};

	const handleFormStartDate = (index, value) => {
		let data = [...fields];
		data[index]["startTime"] = value;
		setFields(data);
	};

	const handleFormEndDate = (index, value) => {
		let data = [...fields];
		data[index]["endTime"] = value;
		setFields(data);
	};

	const handleAddFields = () => {
		setFields([
			...fields,
			{ medicine: "", dosage: "", startTime: "", endTime: "" },
		]);
	};

	const handleRemoveField = (index) => {
		const values = [...fields];
		values.splice(index, 1);
		setFields(values);
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
										name="dosage"
										style={{ marginRight: "10px" }}
										label="Dosage"
										variant="outlined"
										value={input.dosage}
										onChange={(event) => handleFormChange(index, event)}
									/>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<div style={{ marginRight: "10px" }}>
											<DateTimePicker
												name="arrTime"
												label="Start Time"
												value={input.startTime}
												onChange={(newValue) =>
													handleFormStartDate(index, newValue)
												}
											/>
										</div>
										<div style={{ marginRight: "10px" }}>
											<DateTimePicker
												name="endTime"
												label="End Time"
												value={input.endTime}
												onChange={(newValue) =>
													handleFormEndDate(index, newValue)
												}
											/>
										</div>
									</LocalizationProvider>
									<IconButton onClick={handleAddFields}>
										<AddCircleOutlineRounded color="primary" />
									</IconButton>
									<IconButton onClick={() => handleRemoveField(index)}>
										<RemoveCircleOutlineRounded color="primary" />
									</IconButton>
								</div>
							</div>
						);
					})}
				</div>
				<Button
					variant="text"
					color="primary"
					style={{ marginTop: "20px" }}
					onClick={() => console.log(fields)}
				>
					Update
				</Button>
			</Item>
		</div>
	);
};

export default ChatForm;
