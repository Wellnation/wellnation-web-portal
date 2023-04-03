import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { register } from "@/pages/api/auth.hospital";
import Notifications from "@/components/Notifications";

const Register = () => {
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [rePassword, setRePassword] = React.useState("");
	const [checkPass, setCheckPass] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [type, setType] = React.useState("error");

	const handleSubmit = (event) => {
		event.preventDefault();
		checkPass && register(name, email, rePassword, setOpen, setErrorMessage, setType);
	};

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon color="black" />
				</Avatar>
				<Typography component="h1" variant="h5">
					Doctor Register
				</Typography>
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit}
					sx={{ mt: 3 }}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="name"
								label="Name"
								name="name"
								autoComplete="name"
								onChange={(e) => {
									setName(e.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								onChange={(e) => {
									setEmail(e.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="new-password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="check-password"
								label="Retype Password"
								type="password"
								id="check-password"
								autoComplete="new-password"
								onChange={(e) => {
									setRePassword(e.target.value);
									if (e.target.value === password) {
										setCheckPass(true);
									} else {
										setCheckPass(false);
									}
								}}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={checkPass ? false : true}
					>
						Sign Up
					</Button>
					<Notifications open={open} type={type} message={errorMessage} handleClose={handleClose} />
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/doctors/login" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

export default Register;
