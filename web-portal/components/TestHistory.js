import React from "react";
import { db } from "@/lib/firebase.config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useQuery } from "react-query";
import { Loader } from "./utils";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	Chip,
} from "@mui/material";
import { Item } from "@/pages/home";
import Link from "next/link";
import TestReport from "./testReport";

const columns = [
	{ id: "pname", label: "Patient name", minWidth: 180 },
	{ id: "hist", label: "Patient History", minWidth: 150 },
	{ id: "tname", label: "Test Availed", minWidth: 150 },
	{
		id: "shldtime",
		label: "Scheduled On",
		minWidth: 180,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "attachment",
		label: "Report",
		minWidth: 150,
		align: "center",
	},
];

const patientColumns = [
	{
		id: "tname",
		label: "Test Availed",
		minWidth: 100,
	},
	{
		id: "reqtime",
		label: "Requested On",
		minWidth: 150,
		align: "right",
	},
	{
		id: "shldtime",
		label: "Scheduled On",
		minWidth: 150,
		align: "right",
	},
	{
		id: "status",
		label: "Status",
		minWidth: 100,
		align: "right",
	},
	{
		id: "attachment",
		label: "View report",
		minWidth: 100,
		align: "right",
	},
];

const TestHistory = () => {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [openDialog, setOpenDialog] = React.useState(false);
	const [pid, setPid] = React.useState("");
	const [patientHist, setPatientHist] = React.useState(null);
	const [histLoading, setHistLoading] = React.useState(false);
	const hId = localStorage.getItem("hId");

	const {
		data: testsData,
		isLoading,
		error,
		refetch,
	} = useQuery(
		["testHistory"],
		async () => {
			const testsCollection = query(
				collection(db, "testHistory"),
				where("hid", "==", hId),
				where("status", "==", true),
				orderBy("shldtime", "desc")
			);
			const testsSnapshot = await getDocs(testsCollection);
			const testsList = testsSnapshot.docs;
			return testsList;
		},
		{
			refetchOnWindowFocus: true,
			refetchInterval: 5000,
		}
	);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	if (isLoading) return <Loader />;

	return (
		<div>
			<Item
				elevation={4}
				style={{
					margin: "30px 80px",
					padding: "30px",
				}}
			>
				<Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
					Tests History
				</Typography>
				<div>
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
								{testsData
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										return (
											<Row
												key={index}
												row={row.data()}
												rowid={row.id}
												func={refetch}
												open={setOpenDialog}
												patient={setPid}
												history={setPatientHist}
												hId={hId}
												loading={setHistLoading}
											/>
										);
									})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 25, 100]}
						component="div"
						count={testsData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</div>
			</Item>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				fullWidth
				maxWidth={"lg"}
			>
				<DialogTitle>
					<b>Patient History: {pid}</b>
				</DialogTitle>
				<DialogContent>
					{histLoading ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<CircularProgress />
						</div>
					) : (
						<div>
							{patientHist && patientHist.length > 0 ? (
								<TableContainer>
									<Table stickyHeader aria-label="collapsible table">
										<TableHead>
											<TableRow>
												{patientColumns.map((column) => (
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
											{patientHist.map((row) => {
												return (
													<TableRow
														key={row.id}
														sx={{ "& > *": { borderBottom: "unset" } }}
													>
														<TableCell component="th" scope="row">
															{row.data().tname}
														</TableCell>
														<TableCell align="right">
															{row.data().reqtime.toDate().toDateString() +
																" at " +
																row
																	.data()
																	.reqtime.toDate()
																	.toLocaleTimeString("en-us")}
														</TableCell>
														<TableCell align="right">
															{row.data().shldtime.toDate().toDateString() +
																" at " +
																row
																	.data()
																	.shldtime.toDate()
																	.toLocaleTimeString("en-us")}
														</TableCell>
														<TableCell align="right">
															{row.data().status &&
															row.data().attachment ? (
																<Chip
																	label="Completed"
																	color="primary"
																	variant="outlined"
																/>
															) : !row.data().status ? (
																<Chip
																	label="Pending"
																	color="primary"
																	variant="outlined"
																/>
															) : (
																<Chip
																	label="Scheduled"
																	color="primary"
																	variant="outlined"
																/>
															)}
														</TableCell>
														<TableCell align="center">
															{row.data().attachment ? (
																<Link
																	href={row.data().attachment}
																	target="_blank"
																>
																	View Report
																</Link>
															) : (
																<b>No Report</b>
															)}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</TableContainer>
							) : (
								<Typography variant="h6" gutterBottom>
									No history found
								</Typography>
							)}
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

function Row(props) {
	const { row, rowid, func, open, patient, history, hId, loading } = props;

	const handleSetHistory = () => {
		const patientHistoryCollection = query(
			collection(db, "testHistory"),
			where("hid", "==", hId),
			where("patientid", "==", row.patientid),
			orderBy("shldtime", "desc")
		);
		getDocs(patientHistoryCollection).then((patientHistorySnapshot) => {
			patient(row.pname);
			history(patientHistorySnapshot.docs);
			open(true);
			loading(false);
			func();
		});
	};

	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell component="th" scope="row">
					<Link href={`/patients/${row.patientid}`}>{row.pname}</Link>
				</TableCell>
				<TableCell component="th" scope="row">
					<Button onClick={handleSetHistory}>View Patient History</Button>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.tname}
				</TableCell>
				<TableCell align="right">
					{row.shldtime.toDate().toDateString() +
						" at " +
						row.shldtime.toDate().toLocaleTimeString("en-us")}
				</TableCell>
				<TableCell align="center">
					{!row.attachment || row.attachment === "" ? (
						<TestReport testId={rowid} refetchFunc={func} />
					) : (
						<a href={row.attachment} target="_blank">
							View Report
						</a>
					)}
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default TestHistory;
