import * as React from "react"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useQuery } from "react-query"
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
import { useAuth } from "@/lib/zustand.config"
import { NotUser, Loader } from "@/components/utils"
import {
  Box,
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
} from "@mui/material"
import Notifications from "@/components/Notifications"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"
import Skeleton from "@mui/material/Skeleton"

function Row(props) {
  const { row, rowid, func, key, parentFunc } = props
  const [open, setOpen] = React.useState(false)
  const [testTime, setTestTime] = React.useState(dayjs())
  const [openNotif, setOpenNotif] = React.useState(false)
  const [type, setType] = React.useState("success")
  const [message, setMessage] = React.useState("")
  const [docid, setDocid] = React.useState("")
  const [docList, setDocList] = React.useState([])

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenNotif(false)
  }

  function scheduleTest() {
    try {
      const testRef = firestoreDoc(db, "appointments", rowid);
      setDoc(testRef, { shldtime: testTime.toDate() }, { merge: true });
      setType("success");
      setMessage("Appointment scheduled successfully");
      setOpenNotif(true);
      func();
      parentFunc();
    } catch (err) {
      setType("error");
      setMessage("Error scheduling Appointment");
      setOpenNotif(true);
    }
  }

  const { isLoading, error, data } = useQuery({
		queryKey: [rowid],
		queryFn: fetchDetails,
		refetchInterval: 5000,
		refetchOnWindowFocus: true,
	});

  async function fetchDetails() {
    const patRef = firestoreDoc(db, "publicusers", row.pid)
    const pat = await getDoc(patRef)
    if (row.drid.length == 0) return { doc: { name: "NA" }, pat: pat.data() }
    const docRef = firestoreDoc(db, "doctors", row.drid)
    const doc = await getDoc(docRef)
    return { doc: doc.data(), pat: pat.data() }
  }

  function selectDoc() {
    const handleDocChange = (event) => {
    //   setDocid(String(event.target.value) || "")
      console.log(docid)
      try {
        const apptRef = firestoreDoc(db, "appointments", rowid)
        setDoc(apptRef, { drid: docid }, { merge: true })
        setType("success")
        setMessage("Appointed doctor successfully")
		  setOpenNotif(true)
		  handleDocClose()
        func()
      } catch (err) {
        setType("error")
        setMessage("Error in Appointment")
        setOpenNotif(true)
      }
    }

    const handleDocClickOpen = async () => {
      if (row.dept) {
        const deptRef = query(collection(db, `users/${row.hid}/departments`), where("name", "==", row.dept))
        console.log(row.hid, row.dept)
        const doctors = await getDocs(deptRef)
        const doclist = []
        await Promise.all(
          doctors.docs[0].data().doctors.map(async (doc) => {
            const ref = firestoreDoc(db, "doctors", doc.uid)
            const docSnap = await getDoc(ref)
            doclist.push({ doctor: docSnap.data(), ...doc, deptName: row.dept })
          })
        ).then(() => {
          setDocList(doclist)
          setOpen(true)
        })
      } else {
        const deptRef = collection(db, `users/${row.hid}/departments`)
        const doctors = await getDocs(deptRef)
        const doclist = []
        for (const doc of doctors.docs) {
          for (const doctor of doc.data().doctors) {
            const docSnap = await getDoc(firestoreDoc(db, `doctors`, doctor.uid))
            doclist.push({ doctor: docSnap.data(), deptName: doc.data().name, ...doctor })
          }
        }
        setDocList(doclist)
        setOpen(true)
      }
    }

    const handleDocClose = (event, reason) => {
      if (reason !== "backdropClick") {
        setOpen(false)
      }
    }
    return (
      <div>
        <Button onClick={handleDocClickOpen}>Appoint</Button>
        <Dialog disableEscapeKeyDown open={open} onClose={handleDocClose}>
          <DialogTitle>Select a doctor</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Available Doctors</InputLabel>
                <Select
                  native
                  value={docid}
                  onChange={(event) => {
                    setDocid(event.target.value)
                  }}
                  input={<OutlinedInput label="Doctor" id="demo-dialog-native" />}
                >
                  <option aria-label="None" value="" />
                  {docList.map((doc) => {
                    return (
                      <option value={doc.uid}>
                        <ul>
                          <li>
                            ({doc.deptName}) {doc.doctor.name}
                          </li>
                          <li> Arr Time: {doc.arrTime.toDate().toLocaleString()}</li>
                          <li> Dep Time: {doc.depTime.toDate().toLocaleString()}</li>
                        </ul>
                      </option>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDocClose}>Cancel</Button>
            <Button onClick={handleDocChange}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell component="th" scope="row">
					{isLoading ? (
						<Skeleton animation="wave" />
					) : (
						<a href={"/patients/" + row.pid} target="_blank">
							{data.pat.name}
						</a>
					)}
				</TableCell>
				<TableCell component="th" scope="row">
					{isLoading ? <Skeleton animation="wave" /> : data.pat.phone}
				</TableCell>
				<TableCell component="th" scope="row">
					{row.symptoms}
				</TableCell>
				<TableCell component="th" scope="row">
					{row.dept ? row.dept : "NA"}
				</TableCell>
				<TableCell component="th" scope="row">
					{isLoading ? (
						<Skeleton animation="wave" />
					) : row.drid.length > 0 ? (
						data.doc.name
					) : (
						selectDoc()
					)}
				</TableCell>
				<TableCell align="right">
					{row.shldtime.toDate().toDateString() +
						" at " +
						row.shldtime.toDate().toLocaleTimeString("en-us")}
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
  { id: "pname", label: "Patient name", minWidth: 150 },
  { id: "phone", label: "Phone", minWidth: 100 },
  { id: "symptoms", label: "symptoms", minWidth: 100 },
  { id: "dept.", label: "dept", minWidth: 100 },
  { id: "doc", label: "doctor", minWidth: 150 },

  {
    id: "reqtime",
    label: "Requested On",
    minWidth: 180,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "shldtime",
    label: "Scheduled Time",
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
]

export default function History(props) {
  const { func } = props;
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openTest, setOpenTest] = React.useState(false)
  const hId = localStorage.getItem("hId");

  const { user, loading, userError } = useAuth()
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchAppointments,
  })

  async function fetchAppointments() {
    const data = []
    const apt = await getDocs(
			query(
				collection(db, "appointments"),
				where("hid", "==", hId),
				orderBy("reqtime", "desc")
			)
		);
    // await Promise.all(
    //     apt.docs.map(async (doc) => {
    //         const pat = await getDoc(firestoreDoc(db, "publicusers", doc.data().pid))
    //         data.push({ ...doc.data(), ...pat.data() })
    //     })
    // )
    return apt.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  if (!loading && !user) return <NotUser />
  else if (loading || isLoading) return <Loader />
  else if (error) return <h1>Error</h1>

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper sx={{ width: "80%", overflow: "hidden" }} style={{ margin: "1rem 5rem 1rem 5rem" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return <Row key={index} row={row} rowid={row.id} func={refetch} parentFunc={func} />
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "50px 30px",
            }}
          ></div>
        </>
      )}
    </>
  )
}
