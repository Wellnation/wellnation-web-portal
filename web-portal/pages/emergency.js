import * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Dialog,
	DialogTitle,
	Button,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	OutlinedInput,
	Skeleton,
	Box,
	Menu,
	ListItem,
	ListItemText,
	IconButton,
	List,
	ListItemAvatar,
  Avatar,
  Fab,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useQuery } from "react-query";
import {
	query,
	collection,
	getDocs,
	getDoc,
	setDoc,
	doc as firestoreDoc,
	where,
	orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "@/lib/zustand.config";
import { NotUser, Loader } from "@/components/utils";
import Notifications from "@/components/Notifications";
import AmbulanceMap from "@/components/ambulanceMap";
import { Add, Person, PhoneInTalk, Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";

const FamilyButton = ({ row }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const openMenu = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				id="demo-customized-button"
				aria-controls={openMenu ? "demo-customized-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={openMenu ? "true" : undefined}
				onClick={(e) => handleClick(e)}
			>
				See Family Details
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={openMenu}
				onClose={handleClose}
				elevation={2}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				id="demo-customized-menu"
				MenuListProps={{
					"aria-labelledby": "demo-customized-button",
				}}
				style={{
					minWidth: "500px",
				}}
			>
				<List>
					{row.family.length > 0 ? (
						row.family.map((member) => (
							<ListItem
								secondaryAction={
									<IconButton
										edge="end"
										aria-label="delete"
										component={Link}
										href={`tel:${member.phone}`}
									>
										<PhoneInTalk />
									</IconButton>
								}
							>
								<ListItemAvatar>
									<Avatar>
										<Person />
									</Avatar>
								</ListItemAvatar>
								<Link href={`/patients/${member.id}`}>
									<ListItemText
										primary={member.name}
										style={{
											marginRight: "30px",
										}}
									/>
								</Link>
							</ListItem>
						))
					) : (
						<ListItem>
							<ListItemText primary="No family members" />
						</ListItem>
					)}
				</List>
			</Menu>
		</div>
	);
};

function Row(props) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);
	const [openNotif, setOpenNotif] = React.useState(false);
	const [type, setType] = React.useState("success");
	const [message, setMessage] = React.useState("");
	const [amblId, setAmblId] = React.useState("");
	const [ambllist, setAmblList] = React.useState([]);
	const mapUrl = `https://www.google.com/maps/search/?api=1&query=${row.location.latitude},${row.location.longitude}`;

	const { isLoading, error, data } = useQuery({
		queryKey: [row.id],
		queryFn: fetchDetails,
		refetchInterval: 2000,
	});

	async function fetchDetails() {
		if (!row.ambulanceId) return { ambl: { vechilenumber: "NA" } };
		const amblRef = firestoreDoc(db, "ambulance", row.ambulanceId);
		const ambl = await getDoc(amblRef);
		return { ambl: ambl.data() };
	}

	function selectAmbulance() {
		const hid = localStorage.getItem("hId");

		const handleAmblChange = async (event) => {
			const hospital = await getDoc(firestoreDoc(db, "users", hid));
			try {
				const amblRef = firestoreDoc(db, "ambulance", amblId);
				setDoc(
					amblRef,
					{
						status: false,
						pickuplocation: row.location, // location of emergency
						dropLocation: hospital.data().location, // location of hospital
					},
					{ merge: true }
				);
				const emerRef = firestoreDoc(db, "emergency", row.id);
				setDoc(
					emerRef,
					{
						ambulanceId: amblId,
						hid: hid,
					},
					{ merge: true }
				);
				const logDoc = firestoreDoc(collection(db, `emergency/${row.id}/logs`));
				await setDoc(logDoc, {
					action: "Ambulance Assigned",
					senderId: hid,
					timestamp: new Date(),
					senderName: hospital.data().name,
				});
				setType("success");
				setMessage("Ambulance sent successfully");
				setOpenNotif(true);
				handleAmblClose();
				// func()
			} catch (err) {
				setType("error");
				setMessage("Error in Ambulance");
				setOpenNotif(true);
			}
		};

		const handleAmblClickOpen = async () => {
			const amblSnap = await getDocs(
				query(collection(db, "ambulance"), where("hid", "==", hid))
			);
			const amblList = amblSnap.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});
			setAmblList(amblList);
			setOpen(true);
		};

		const handleAmblClose = (event, reason) => {
			if (reason !== "backdropClick") {
				setOpen(false);
			}
		};
		return (
			<div>
				<Button onClick={handleAmblClickOpen}>Assign</Button>
				<Dialog disableEscapeKeyDown open={open} onClose={handleAmblClose}>
					<DialogTitle>Select one of your available ambulances</DialogTitle>
					<DialogContent>
						<Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<InputLabel htmlFor="demo-dialog-native">
									Available Ambulances
								</InputLabel>
								<Select
									native
									value={amblId}
									onChange={(event) => {
										setAmblId(event.target.value);
										console.log(ambllist);
									}}
									input={
										<OutlinedInput label="Ambulances" id="demo-dialog-native" />
									}
								>
									<option aria-label="None" value="" />
									{ambllist.map((doc) => {
										return (
											doc.status === true && (
												<option value={doc.id} key={doc.id}>
													({doc.vechilenumber}) {doc.contact}
												</option>
											)
										);
									})}
								</Select>
							</FormControl>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleAmblClose}>Cancel</Button>
						<Button onClick={handleAmblChange}>Ok</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}

	const handleCloseNotif = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenNotif(false);
	};

	if (!isLoading && error) {
		console.log(error);
		return <div>An error occurred</div>;
	}

	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell component="th" scope="row">
					{row.name}
				</TableCell>
				<TableCell component="th" scope="row">
					{row.phone}
				</TableCell>
				<TableCell>
					<FamilyButton row={row} />
				</TableCell>
				<TableCell align="right">
					{row.date.toDate().toDateString() +
						" at " +
						row.date.toDate().toLocaleTimeString("en-us")}
				</TableCell>
				<TableCell align="right">
					{isLoading && !error ? (
						<Skeleton variant="text" />
					) : !row.ambulanceId ? (
						selectAmbulance()
					) : (
						data.ambl.vechilenumber
					)}
				</TableCell>
				<TableCell align="right">
					<a href={mapUrl} target="_blank">
						View in maps
					</a>
				</TableCell>
				<TableCell align="right">
					{row.ambulanceId ? "Ambulance Scheduled" : "Pending"}
        </TableCell>
        <TableCell align="right">
          {row.pickupStatus ? "Picked up" : "Not picked up"}
        </TableCell>
				<TableCell align="right">
					<a href={"/patients/" + row.pid} target="_blank">
						View details
					</a>
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
	{ id: "name", label: "Patient name", minWidth: 100 },
	{ id: "phone", label: "Patient's phone", minWidth: 50 },
	{
		id: "family",
		label: "Family members",
		minWidth: 50,
		align: "right",
	},
	{
		id: "date",
		label: "Time of emergency",
		minWidth: 100,
		align: "right",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "ambulance",
		label: "Ambulance",
		align: "right",
		minWidth: 50,
	},
	{
		id: "location",
		label: "Location",
		minWidth: 100,
		align: "right",
	},
	{
		id: "status",
		label: "Ambulance Status",
		minWidth: 100,
		align: "right",
  },
  {
    id: "pickup",
    label: "Pickup",
    minWidth: 100,
    align: "right",
  },
	{
		id: "pid",
		label: "Patient details",
		minWidth: 100,
		align: "right",
	},
];

export default function History() {
  const [page, setPage] = React.useState(0);
  const [showPass, setShowPass] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ambulanceModal, setAmbulanceModal] = React.useState(false);
  const [ambulanceNo, setAmbulanceNo] = React.useState("");
  const [ambulanceCost, setAmbulanceCost] = React.useState(0);
  const [ambulancePass, setAmbulancePass] = React.useState("");
  const [ambulanceDriver, setAmbulanceDriver] = React.useState("");
  const [ambulanceContact, setAmbulanceContact] = React.useState("");
  const [notif, setNotif] = React.useState({
    open: false,
    message: "",
    type: "",
  });
  const hId = localStorage.getItem("hId");

  const handleAmblAdd = async () => {
    const ambulanceCol = collection(db, "ambulance");
    const hospitalDoc = await getDoc(firestoreDoc(db, "users", hId));
    const hospitalLocation = hospitalDoc.data().location;
    const newAmbulance = firestoreDoc(ambulanceCol);
    await setDoc(newAmbulance, {
      authpass: ambulancePass,
      contact: ambulanceContact,
      cost: ambulanceCost,
      vechilenumber: ambulanceNo,
      driverName: ambulanceDriver,
      hid: hId,
      currentlocation: hospitalLocation,
      dropLocation: null,
      pickuplocation: null,
      status: true,
      pickupStatus: false,
      fcmToken: "",
      distance: 0,
      eta: 0,
      id: newAmbulance.id,
      pid: ""
		});
		const logDoc = firestoreDoc(collection(db, `emergency/`))
    setNotif({
      open: true,
      message: "Ambulance added successfully",
      type: "success",
    });
    setAmbulanceModal(false);
  };

  const handleAmblClose = () => {
    setAmbulanceModal(false);
    setAmbulanceContact("");
    setAmbulanceCost(0);
    setAmbulanceDriver("");
    setAmbulanceNo("");
    setAmbulancePass("");
  };

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotif({
      open: false,
      message: "",
      type: "",
    });
  };

	const { user, loading, userError } = useAuth();
	const {
		data: emergencyData,
		isLoading,
		error,
		refetch,
	} = useQuery(
		["emergency"],
		async () => {
			const queryCol = query(
				collection(db, "emergency"),
				orderBy("date", "desc")
			);
			const querySnapshot = await getDocs(queryCol);
			const data = [];
			await Promise.all(
				querySnapshot.docs.map(async (doc) => {
					const patientDoc = await getDoc(
						firestoreDoc(db, "publicusers", doc.data().pid)
					);
					const familyData = [];
					const familyDocs = await getDocs(
						query(
							collection(db, "publicusers"),
							where("familyId", "==", patientDoc.data().familyId),
							where("name", "!=", patientDoc.data().name)
						)
					);
					familyDocs.forEach((doc) => {
						familyData.push({
							name: doc.data().name,
							phone: doc.data().phone,
							id: doc.id,
							address: doc.data().address,
						});
					});
					data.push({
						...doc.data(),
						...patientDoc.data(),
						id: doc.id,
						family: familyData,
					});
				})
			);
			return data;
		},
		{
			refetchOnWindowFocus: false,
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

	if (!isLoading && !user) return <NotUser />;
	else if (isLoading) return <Loader />;
	else if (error) {
		return (
			<div>
				An error occurred: {error.message}
				<br />
				{user.email}
			</div>
		);
	}

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingTop: "50px",
					fontWeight: 900,
					fontSize: "1.5rem",
				}}
			>
				Recent Emergencies
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{isLoading ? (
					<Loader />
				) : (
					<>
						<Paper
							sx={{ width: "80%", overflow: "hidden" }}
							style={{ margin: "1rem 5rem 1rem 5rem" }}
						>
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
										{emergencyData
											.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											.map((row, index) => {
												return <Row key={index} row={row} />;
											})}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[10, 25, 100]}
								component="div"
								count={emergencyData.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Paper>
					</>
				)}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingTop: "50px",
					paddingBottom: "50px",
					fontWeight: 900,
					fontSize: "1.5rem",
				}}
			>
				<AmbulanceMap />
			</div>
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: "fixed",
					bottom: "120px",
					right: "20px",
				}}
				onClick={() => setAmbulanceModal(true)}
			>
				<Add />
			</Fab>
			<Dialog open={ambulanceModal} onClose={handleAmblClose} fullWidth>
				<DialogTitle>Add Ambulance Details</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Ambulance Number"
						variant="outlined"
						value={ambulanceNo}
						onChange={(e) => {
							setAmbulanceNo(e.target.value);
						}}
					/>
					<TextField
						autoFocus
						fullWidth
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Ambulance Driver Name"
						variant="outlined"
						value={ambulanceDriver}
						onChange={(e) => {
							setAmbulanceDriver(e.target.value);
						}}
					/>
					<TextField
						autoFocus
						fullWidth
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Ambulance Driver Password"
						variant="outlined"
						type={showPass ? "text" : "password"}
						value={ambulancePass}
						onChange={(e) => {
							setAmbulancePass(e.target.value);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPass(!showPass)}
									>
										{showPass ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						autoFocus
						fullWidth
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Ambulance Cost"
						variant="outlined"
						type="number"
						value={ambulanceCost}
						onChange={(e) => {
							setAmbulanceCost(e.target.value);
						}}
					/>
					<TextField
						autoFocus
						fullWidth
						style={{ marginTop: "10px" }}
						id="outlined-basic"
						label="Ambulance Contact No"
						variant="outlined"
						type="tel"
						value={ambulanceContact}
						onChange={(e) => {
							setAmbulanceContact(e.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAmblAdd}>Add</Button>
					<Button onClick={handleAmblClose}>Cancel</Button>
				</DialogActions>
      </Dialog>
      <Notifications
        open={notif.open}
        message={notif.message}
        type={notif.type}
        handleClose={handleCloseNotif}
      />
		</>
	);
}
