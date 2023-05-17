import * as React from "react"
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
  Fab,
  TextField,
  Button,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Skeleton,
  Box,
} from "@mui/material"
import { useQuery } from "react-query"
import { query, collection, getDocs, onSnapshot, getDoc, setDoc, doc as firestoreDoc, where } from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import { useAuth } from "@/lib/zustand.config"
import { NotUser, Loader } from "@/components/utils"
import Notifications from "@/components/Notifications"

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)
  const [openNotif, setOpenNotif] = React.useState(false)
  const [type, setType] = React.useState("success")
  const [message, setMessage] = React.useState("")
  const [amblId, setAmblId] = React.useState("")
  const [ambllist, setAmblList] = React.useState([])
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${row.location.latitude},${row.location.longitude}`

  const { isLoading, error, data } = useQuery({
    queryKey: [row.id],
    queryFn: fetchDetails,
  })

  async function fetchDetails() {
    if (!row.ambulanceId) return { ambl: { vechilenumber: "NA" } }
    const amblRef = firestoreDoc(db, "ambulance", row.ambulanceId)
    const ambl = await getDoc(amblRef)
    return { ambl: ambl.data() }
  }

  function selectAmbulance() {
    const hid = localStorage.getItem("hId")

    const handleAmblChange = async (event) => {
      const hospital = await getDoc(firestoreDoc(db, "users", hid))
      try {
        const amblRef = firestoreDoc(db, "ambulance", amblId)
        setDoc(
          amblRef,
          {
            status: true,
            pickuplocation: row.location, // location of emergency
            dropLocation: hospital.data().location, // location of hospital
          },
          { merge: true }
        )
        const emerRef = firestoreDoc(db, "emergency", row.id)
        setDoc(
          emerRef,
          {
            ambulanceId: amblId,
            hid: hid,
          },
          { merge: true }
        )
        setType("success")
        setMessage("Ambulance sent successfully")
        setOpenNotif(true)
        handleAmblClose()
        // func()
      } catch (err) {
        setType("error")
        setMessage("Error in Ambulance")
        setOpenNotif(true)
      }
    }

    const handleAmblClickOpen = async () => {
      const amblSnap = await getDocs(query(collection(db, "ambulance"), where("hid", "==", hid)))
      const amblList = amblSnap.docs.map((doc) => {
        return { id: doc.id, ...doc.data() }
      })
      setAmblList(amblList)
      setOpen(true)
    }

    const handleAmblClose = (event, reason) => {
      if (reason !== "backdropClick") {
        setOpen(false)
      }
    }
    return (
      <div>
        <Button onClick={handleAmblClickOpen}>Assign</Button>
        <Dialog disableEscapeKeyDown open={open} onClose={handleAmblClose}>
          <DialogTitle>Select one of your available ambulances</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Available Ambulances</InputLabel>
                <Select
                  native
                  value={amblId}
                  onChange={(event) => {
                    setAmblId(event.target.value)
                  }}
                  input={<OutlinedInput label="Ambulances" id="demo-dialog-native" />}
                >
                  <option aria-label="None" value="" />
                  {ambllist.map((doc) => {
                    return (
                      doc.status === false && (
                        <option value={doc.id} key={doc.id}>
                          ({doc.vechilenumber}) {doc.contact}
                        </option>
                      )
                    )
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
    )
  }

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenNotif(false)
  }

  if (!isLoading && error) {
    console.log(error)
    return <div>An error occurred</div>
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
        <TableCell align="right">
          {row.date.toDate().toDateString() + " at " + row.date.toDate().toLocaleTimeString("en-us")}
        </TableCell>
        <TableCell align="right">
          {isLoading ? <Skeleton variant="text" /> : !row.ambulanceId ? selectAmbulance() : data.ambl.vechilenumber}
        </TableCell>
        <TableCell align="right">
          <a href={mapUrl} target="_blank">
            View in maps
          </a>
        </TableCell>
        <TableCell align="right">{row.status ? "Accepted" : "Pending"}</TableCell>
        <TableCell align="right">
          <a href={"/patients/" + row.pid} target="_blank">
            View details
          </a>
        </TableCell>
      </TableRow>
      <Notifications type={type} message={message} open={openNotif} handleClose={handleCloseNotif} />
    </React.Fragment>
  )
}

const columns = [
  { id: "name", label: "Patient name", minWidth: 100 },
  { id: "phone", label: "Patient phone", minWidth: 50 },
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
    label: "status",
    minWidth: 100,
    align: "right",
  },
  {
    id: "pid",
    label: "More details",
    minWidth: 100,
    align: "right",
  },
]

export default function History() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const hId = localStorage.getItem("hId")

  const { user, loading, userError } = useAuth()
  // const { data, isLoading, error, refetch } = useQuery("emergency", async () => {
  //   const q = getDocs(collection(db, "emergency"))
  //   const data = []
  //   const user = await Promise.all(
  //     (
  //       await q
  //     ).docs.map(async (doc) => {
  //       const pt = await getDoc(firestoreDoc(db, "publicusers", doc.data().pid))
  //       data.push({ ...doc.data(), ...pt.data(), id: doc.id })
  //     })
  //   )
  //   console.log(data)
  //   return data
  // })
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const emergencyCollection = collection(db, "emergency")
      const data = []
      const unsubscribe = onSnapshot(emergencyCollection, async (snapshot) => {
        await Promise.all(
          snapshot.docs.map(async (doc) => {
            const pt = await getDoc(firestoreDoc(db, "publicusers", doc.data().pid))
            data.push({ ...doc.data(), ...pt.data(), id: doc.id })
          })
        )
        setData(data)
        setIsLoading(false)
      })
      return () => unsubscribe()
    } catch (err) {
      setError(err)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  if (!loading && !user) return <NotUser />
  else if (loading || isLoading) return <Loader />
  else if (error) {
    return (
      <div>
        An error occurred: {error.message}
        <br />
        {user.email}
      </div>
    )
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
        Recent Emergency
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
                    return <Row key={index} row={row} />
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
        )}
      </div>
    </>
  )
}
