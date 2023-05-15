import React from "react";
import { IconButton, Paper, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AddCircleOutlineRounded } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
	height: "100%",
}));

const ChatForm = () => {
	const [fields, setFields] = React.useState([]);
  const [medicines, setMedicines] = React.useState([]);
  const temp = [];

	const handleAddField = () => {
		console.log(fields, medicines);
		setFields([...fields, ""]);
	};

	const Field = (value, index) => {
		return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
				<TextField
					label="Medicine"
					variant="outlined"
					value={value}
          onChange={(e) => {
            temp[index] = e.target.value;
            // setMedicines(temp);
          }}
				/>
				<IconButton onClick={handleAddField}>
					<AddCircleOutlineRounded color="primary" />
				</IconButton>
			</div>
		);
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
					<Field index={0} value={temp[0] ? temp[0] : ""} />
					{fields.map((field, index) => {
						return (
							<div key={index} style={{marginTop: "20px"}}>
								<Field index={index+1} value={temp[index] ? temp[index] : ""} />
							</div>
						);
					})}
        </div>
        <Button
          variant="text"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={() => console.log(temp)}
        >
          Update
        </Button>
			</Item>
		</div>
	);
};

export default ChatForm;
