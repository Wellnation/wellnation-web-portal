import * as React from "react";
import {
	Box,
	Stepper,
	Step,
	StepButton,
	StepContent,
	Button,
	Typography,
	Fab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Autocomplete,
	CircularProgress,
	TextField,
	Popper,
	MenuItem,
} from "@mui/material";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import {
	collection,
	getDocs,
	where,
	query,
	getDoc,
	doc as firestoreDoc,
	setDoc,
	orderBy,
	doc,
	updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Loader } from "@/components/utils";
import AdmissionLogs from "@/components/AdmissionLogs";
import { Add, PlaylistAdd } from "@mui/icons-material";
import { Item } from "@/pages/home";
import Notifications from "@/components/Notifications";

export default function VerticalLinearStepper() {
	const router = useRouter();
	const hId = router.query.hId;
	const bedId = router.query.bedId;
	const [activeStep, setActiveStep] = React.useState(0);
	const [logsize, setLogsize] = React.useState(0);
	const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
	const [admissionId, setAdmissionId] = React.useState("");
	const status = ["Vacant", "Occupied"];
	const [statusSelect, setStatusSelect] = React.useState("");
	const [patientSelect, setPatientSelect] = React.useState(null);
	const [patientId, setPatientId] = React.useState("");
	const [openPatientSelect, setOpenPatientSelect] = React.useState(false);
	const [patientsData, setPatientsData] = React.useState([]);
	const [patientsLoading, setPatientsLoading] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [apptId, setApptId] = React.useState("");
	const [histDialogOpen, setHistDialogOpen] = React.useState(false);
	const [historyData, setHistoryData] = React.useState(null);
	const [andhorHistEl, setAnchorHistEl] = React.useState(null);
	const [notif, setNotif] = React.useState({
		open: false,
		message: "",
		type: "",
	});

	const bedInfo = useQuery({
		queryKey: ["bedInfo", bedId],
		queryFn: fetchBedInfo,
	});

	const admissionInfo = useQuery({
		queryKey: ["admissionInfo", hId],
		queryFn: fetchAdmissionInfo,
	});

	async function fetchBedInfo() {
		const bedRef = firestoreDoc(db, `users/${hId}/beds`, bedId);
		const bedDoc = await getDoc(bedRef);
		return bedDoc.data();
	}

	async function fetchAdmissionInfo() {
		const admissionRef = query(
			collection(db, "admissions"),
			where("bedId", "==", bedId)
		);
		const admissionSnapshot = await getDocs(admissionRef);
		if (admissionSnapshot.empty) return { admissionId: null, logs: [] };
		setAdmissionId(admissionSnapshot.docs[0].id);
		// logs
		const logsRef = query(
			collection(db, "admissions", admissionSnapshot.docs[0].id, "logs"),
			orderBy("logDate", "desc")
		);
		const logsSnapshot = await getDocs(logsRef);
		const logs = logsSnapshot.docs.map((doc) => {
			return { ...doc.data(), id: doc.id };
		});
		setActiveStep(0);
		setLogsize(logs.length - 1);
		const patientRef = firestoreDoc(
			db,
			"publicusers",
			admissionSnapshot.docs[0].data().pId
		);
		const patientDoc = await getDoc(patientRef);
		return {
			...admissionSnapshot.docs[0].data(),
			admissionId: admissionSnapshot.docs[0].id,
			logs,
			patient: patientDoc.data(),
		};
	}

	async function addLogs() {
		const logRef = collection(
			db,
			"admissions",
			admissionInfo.data.admissionId,
			"logs"
		);
		const newid = firestoreDoc(logRef).id;
		await setDoc(
			firestoreDoc(
				db,
				`admissions/${admissionInfo.data.admissionId}/logs`,
				newid
			),
			{
				logDate: new Date(),
				doctors: [],
				meds: [],
				tests: [],
			}
		)
			.then(() => {
				admissionInfo.refetch();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function fetchPatientsData() {
		setPatientsLoading(true);
		const patientsRef = query(
			collection(db, "publicusers"),
			where("name", ">=", patientSelect),
			where("name", "<=", patientSelect + "\uf8ff")
		);
		const patientsSnapshot = await getDocs(patientsRef);
		setPatientsData(
			patientsSnapshot.docs.map((doc) => {
				return { ...doc.data(), id: doc.id };
			})
		) && setPatientsLoading(false);
	}

	const handleAdmission = async () => {
		const admissionCol = collection(db, "admissions");
		const hospitalDocRef = doc(db, "users", hId);
		const hospitalSnap = await getDoc(hospitalDocRef);
		const bedsDoc = doc(db, `users/${hId}/beds`, bedId);
		const bedsSnap = await getDoc(bedsDoc);
		const bedType = bedsSnap.data().type;
		const bedPrice = hospitalSnap
			.data()
			.roomTypes.filter((item) => item.type === bedType);
		if (statusSelect === "Occupied") {
			const admissionDocRef = doc(admissionCol);
			await setDoc(admissionDocRef, {
				pId: patientId,
				bedId: bedId,
				hId: hId,
				hName: hospitalSnap.data().name,
				dateAdmitted: new Date(),
				dateReleased: null,
				apptId: apptId,
				price: Number(bedPrice[0].cost),
				status: true,
			});
			await updateDoc(bedsDoc, {
				status: false,
				pid: patientId,
			});
			setOpenPatientSelect(false);
		} else {
			const admissionDoc = doc(db, "admissions", admissionId);
			await updateDoc(admissionDoc, {
				dateReleased: new Date(),
				status: false,
			});
			const bedDoc = doc(db, `users/${hId}/beds`, bedId);
			await updateDoc(bedDoc, {
				status: true,
				pid: "",
			});
			setOpenPatientSelect(false);
		}
		setNotif({
			open: true,
			message: "Admission status updated successfully!",
			type: "success",
		});
	};

	const fetchHistoryData = async () => {
		const data = [];
		if (patientId !== "") {
			const historyRef = query(
				collection(db, "appointments"),
				where("pId", "==", patientId),
				where("hid", "==", hId),
				orderBy("shldtime", "desc")
			);
			const historySnapshot = await getDocs(historyRef);
			await Promise.all(
				historySnapshot.docs.map(async (doc) => {
					const doctorRef = firestoreDoc(db, "doctors", doc.data().drid);
					const doctorSnap = await getDoc(doctorRef);
					data.push({
						...doc.data(),
						id: doc.id,
						doctor: doctorSnap.data(),
					});
				})
			);
			setHistoryData(data);
		}
	};

	return (
		<>
			{bedInfo.isLoading || admissionInfo.isLoading ? (
				<Loader />
			) : bedInfo.error || admissionInfo.error ? (
				<Typography variant="h6" style={{ fontWeight: "bold", margin: "20px" }}>
					This bed has been deleted or does not exist.
				</Typography>
			) : (
				<Box
					sx={{
						maxWidth: "100vw",
						justifyContent: "space-around",
						alignItems: "center",
						margin: "2rem 5vw",
					}}
				>
					<Item
						elevation={1}
						style={{
							padding: "1rem 2rem",
							margin: "1rem 0",
						}}
					>
						<Typography
							variant="h6"
							style={{ fontWeight: "bold", margin: "20px auto" }}
						>
							Room No: {bedInfo.data.roomNo}
							<br />
							Bed No: {bedInfo.data.bedNo}
						</Typography>
						{bedInfo.data.status ? null : (
							<Typography variant="h6" style={{ margin: "0 20px" }}>
								<ul>
									<li>
										Patient Name : <b>{admissionInfo.data.patient.name}</b>
									</li>
									<li>
										Patient dob : <b>{admissionInfo.data.patient.dob}</b>
									</li>
									<li>
										Date Admitted :{" "}
										<b>
											{admissionInfo.data.dateAdmitted.toDate().toDateString()}{" "}
											at{" "}
											{admissionInfo.data.dateAdmitted
												.toDate()
												.toLocaleTimeString()}
										</b>
									</li>
								</ul>
							</Typography>
						)}
					</Item>
					{bedInfo.data.status ? (
						<Typography
							variant="h6"
							style={{ fontWeight: "bold", margin: "20px auto" }}
						>
							This bed is not occupied yet.
						</Typography>
					) : (
						<>
							{logsize != -1 &&
							admissionInfo.data.logs[0].logDate.toDate().toDateString() ===
								new Date().toDateString() ? null : (
								<Button
									onClick={addLogs}
									sx={{ mt: 1, mr: 1 }}
									startIcon={<PlaylistAdd />}
									color="primary"
								>
									Add new entry
								</Button>
							)}
							<Stepper nonLinear activeStep={activeStep} orientation="vertical">
								{admissionInfo.data.logs.map((log, index) => (
									<Step key={index}>
										<StepButton
											color="secondary"
											style={{ color: "black" }}
											onClick={() => setActiveStep(index)}
										>
											{log.logDate.toDate().toDateString()}
										</StepButton>
										<StepContent>
											<Item elevation={3}>
												<AdmissionLogs
													log={log}
													admissionId={admissionInfo.data.admissionId}
													refetchFunc={admissionInfo.refetch}
													hId={hId}
												/>
											</Item>
										</StepContent>
									</Step>
								))}
							</Stepper>
						</>
					)}
				</Box>
			)}
			<Fab
				color="primary"
				aria-label="add"
				sx={{ position: "fixed", bottom: "100px", right: "1.5rem" }}
				onClick={() => setStatusDialogOpen(true)}
			>
				<Add />
			</Fab>
			<Dialog
				open={statusDialogOpen}
				onClose={() => setStatusDialogOpen(false)}
			>
				<DialogTitle>Change Occupant Details</DialogTitle>
				<DialogContent>
					<Autocomplete
						style={{ marginTop: "10px" }}
						freeSolo
						disableClearable
						value={statusSelect}
						options={status}
						fullWidth
						renderInput={(params) => (
							<TextField
								{...params}
								label="Bed Status"
								variant="outlined"
								value={statusSelect}
								InputProps={{ ...params.InputProps, type: "search" }}
							/>
						)}
						onChange={(e, value) => {
							e.preventDefault();
							setStatusSelect(value);
						}}
					/>
					<TextField
						style={{ marginTop: "10px" }}
						label="Select Patient"
						value={patientSelect}
						fullWidth
						InputProps={{
							endAdornment: (
								<React.Fragment>
									{patientsLoading ? (
										<CircularProgress color="primary" size={20} />
									) : null}
								</React.Fragment>
							),
						}}
						onFocus={(e) => {
							e.preventDefault();
							setOpenPatientSelect(true);
							setAnchorEl(e.currentTarget);
						}}
						onChange={(e) => {
							e.preventDefault();
							setPatientSelect(e.target.value);
							fetchPatientsData();
						}}
					/>
					<Popper
						open={openPatientSelect}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "left",
						}}
						style={{ zIndex: 9999 }}
					>
						<Item elevation={3} style={{ padding: "1rem", width: "250px" }}>
							{patientsData.length > 0 ? (
								patientsData.map((patient) => (
									<MenuItem
										key={patient.patientId}
										onClick={() => {
											setPatientSelect(patient.name);
											setPatientId(patient.userid);
											setOpenPatientSelect(false);
										}}
									>
										<b>{patient.name}</b>
									</MenuItem>
								))
							) : (
								<MenuItem>
									<b>No patients found</b>
								</MenuItem>
							)}
						</Item>
					</Popper>
					<AppointmentSelect patient={patientId}  />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleAdmission()}>Update</Button>
					<Button
						onClick={() => {
							setStatusDialogOpen(false);
							setStatusSelect("");
							setPatientSelect("");
							setPatientId("");
						}}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<Notifications
				open={notif.open}
				handleClose={(e, reason) => {
					if (reason === "clickaway") {
						return;
					}
					setNotif({ open: false, message: "", type: "" });
				}}
				message={notif.message}
				type={notif.type}
			/>
		</>
	);
}
