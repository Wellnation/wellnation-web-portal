import * as React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useQuery } from "react-query";
import {
	collection,
	getDocs,
	where,
	query,
	getDoc,
	doc as firestoreDoc,
	setDoc,
	orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "@/lib/zustand.config";
import { NotUser, Loader } from "@/components/utils";
import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Dialog,
	DialogTitle,
	Fab,
	TextField,
	Button,
	Autocomplete,
} from "@mui/material";
import Notifications from "@/components/Notifications";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import TestReport from "@/components/testReport";
import TestManager from "@/components/TestManager";
import TestHistory from "@/components/TestHistory";
import { Item } from "./home";

// TODO's:
// TODO-1. Requested tests DataGrid
// TODO-2. Scheduled tests(History) DataGrid
// TODO-3. View Test Report

function Row(props) {
	const { row, rowid, func } = props;
	const [open, setOpen] = React.useState(false);
	const [testTime, setTestTime] = React.useState(dayjs());
	const [openNotif, setOpenNotif] = React.useState(false);
	const [type, setType] = React.useState("success");
	const [message, setMessage] = React.useState("");

	const handleCloseNotif = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenNotif(false);
	};

	function scheduleTest() {
		try {
			const testRef = firestoreDoc(db, "testHistory", rowid);
			setDoc(
				testRef,
				{ shldtime: testTime.toDate(), status: true },
				{ merge: true }
			);
			setType("success");
			setMessage("Test scheduled successfully");
			setOpenNotif(true);
			func();
		} catch (err) {
			setType("error");
			setMessage("Error scheduling test");
			setOpenNotif(true);
		}
	}

	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.pname}
				</TableCell>
				<TableCell component="th" scope="row">
					{row.tname}
				</TableCell>
				<TableCell align="right">
					{row.reqtime.toDate().toDateString() +
						" at " +
						row.reqtime.toDate().toLocaleTimeString("en-us")}
				</TableCell>
				<TableCell align="right">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateTimePicker
							label="Test Time"
							value={testTime}
							onChange={(newValue) => {
								setTestTime(newValue);
							}}
						/>
					</LocalizationProvider>
				</TableCell>
				<TableCell align="right">
					{row.status ? (
						"Scheduled"
					) : (
						<Button
							variant="text"
							onClick={scheduleTest}
							startIcon={<CloudUploadIcon />}
						>
							Update schedule
						</Button>
					)}
				</TableCell>
			</TableRow>
			<Notifications
				type={type}
				message={message}
				open={openNotif}
				handleClose={handleCloseNotif}
			/>
		</React.Fragment>
	);
}

const columns = [
	{ id: "patientHist", label: "Patient history", minWidth: 10 },
	{ id: "pname", label: "Patient name", minWidth: 200 },
	{ id: "tname", label: "Test", minWidth: 150 },
	{
		id: "reqtime",
		label: "Requested On",
		minWidth: 180,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "shldtime",
		label: "Schedule Time",
		minWidth: 180,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "status",
		label: "Status",
		minWidth: 100,
		align: "right",
	},
];

export default function History() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [openTest, setOpenTest] = React.useState(false);
	const hId = localStorage.getItem("hId");

	const { user, loading, userError } = useAuth();
	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ["tests"],
		queryFn: fetchtests,
	});

	async function fetchtests() {
		const data = {};
		const testHist = await getDocs(
			query(
				collection(db, "testHistory"),
				where("hid", "==", hId),
				where("status", "==", false)
				// orderBy("reqtime", "desc")
			)
		);
		const alltests = await getDocs(
			query(collection(db, "tests"), where("hid", "==", hId))
		);
		data.alltests = alltests.docs;
		data.testHist = testHist.docs;
		return data;
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	if (!loading && !user) return <NotUser />;
	else if (loading || isLoading) return <Loader />;
	else if (error) return <h1>Error</h1>;

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div>
						<Item style={{ margin: "30px 80px", padding: "30px" }}>
							<TableContainer sx={{ maxHeight: 440 }}>
								<Table stickyHeader aria-label="collapsible table">
									<TableHead>
										<TableRow>
											{columns.map((column) => (
												<TableCell
													key={column.id}
													align={column.align}
													style={{ minWidth: column.minWidth }}
												>
													{column.label}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{data.testHist
											.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											.map((row, index) => {
												return (
													<Row
														key={index}
														row={row.data()}
														rowid={row.id}
														func={refetch}
													/>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[10, 25, 100]}
								component="div"
								count={data.testHist.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Item>
					</div>
					{/* <TestReport /> */}
					<TestHistory />
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							padding: "50px 30px",
						}}
					>
						<TestManager data={data} />
						<Fab
							color="primary"
							aria-label="add"
							sx={{
								position: "fixed",
								bottom: "120px",
								right: "20px",
							}}
							onClick={() => setOpenTest(true)}
						>
							<AddIcon />
						</Fab>
						<AddTestDialog
							open={openTest}
							onClose={() => setOpenTest(false)}
							func={refetch}
						/>
					</div>
				</>
			)}
		</>
	);
}

const AddTestDialog = (props) => {
	const { onClose, selectedValue, open, func } = props;
	const [testName, setTestName] = React.useState("");
	const [price, setPrice] = React.useState("");
	const [testType, setTestType] = React.useState("");
	const [testDesc, setTestDesc] = React.useState("");
	const [openNotif, setOpenNotif] = React.useState(false);
	const [type, setType] = React.useState("error");
	const [message, setMessage] = React.useState("");

	const handleCloseNotif = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenNotif(false);
	};

	const handleClose = () => {
		setTestName("");
		setPrice("");
		setTestType("");
		setTestDesc("");
		onClose(selectedValue);
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		try {
			const hospitalId = localStorage.getItem("hId");
			const hosp = await getDoc(firestoreDoc(db, "users", hospitalId));
			const colRef = collection(db, "tests");
			const newid = firestoreDoc(colRef).id;
			await setDoc(firestoreDoc(db, "tests", newid), {
				hid: hospitalId,
				testname: testName,
				testprice: price,
				hospitalname: hosp.data().name,
				location: hosp.data().location,
				testid: newid,
				type: testType,
				description: testDesc,
			});

			setType("success");
			setMessage("Test Added Successfully");
			setOpenNotif(true);
			setTestName("");
			setPrice("");
			setTestType("");
			setTestDesc("");
			func();
			setTimeout(() => {
				setOpenNotif(false);
				onClose(selectedValue);
			}, 2000);
		} catch (error) {
			console.log(error);
			setType("error");
			setMessage(error.message);
			setOpenNotif(true);
		}
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Add Test</DialogTitle>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					padding: "20px",
					width: "500px",
				}}
			>
				<TextField
					id="outlined-basic"
					label="Test Name"
					variant="outlined"
					value={testName}
					onChange={(e) => {
						setTestName(e.target.value);
					}}
				/>
				<TextField
					id="outlined-basic"
					label="Test price"
					variant="outlined"
					value={price}
					onChange={(e) => {
						setPrice(e.target.value);
					}}
				/>
				<Autocomplete
					freeSolo
					disableClearable
					options={["Test", "Package"]}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Type"
							variant="outlined"
							value={testType}
							InputProps={{ ...params.InputProps, type: "search" }}
						/>
					)}
					onChange={(e, value) => setTestType(value)}
				/>
				<TextField
					id="outlined-basic"
					label="Test Description"
					variant="outlined"
					value={testDesc}
					onChange={(e) => {
						setTestDesc(e.target.value);
					}}
				/>
				<div
					style={{
						display: "flex",
						justifyContent: "space-evenly",
						gap: "10px",
					}}
				>
					<Button
						variant="text"
						onClick={(e) => handleUpload(e)}
						startIcon={<CloudUploadIcon />}
					>
						Add Test
					</Button>
					<Button
						variant="text"
						onClick={handleClose}
						startIcon={<CancelIcon />}
					>
						Cancel
					</Button>
				</div>
			</div>
			<Notifications
				type={type}
				message={message}
				open={openNotif}
				handleClose={handleCloseNotif}
			/>
		</Dialog>
	);
};
