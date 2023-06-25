import * as React from "react"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useQuery } from "react-query"
import { collection, getDocs, where, query, getDoc, doc as firestoreDoc, setDoc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase.config"
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
import { DataGrid } from "@mui/x-data-grid"
import Notifications from "@/components/Notifications"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"
import Skeleton from "@mui/material/Skeleton"

export default function History(props) {
  const { func } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openTest, setOpenTest] = React.useState(false)
  const hId = localStorage.getItem("hId")
  const [open, setOpen] = React.useState(false)
  const [testTime, setTestTime] = React.useState()
  const [openNotif, setOpenNotif] = React.useState(false)
  const [type, setType] = React.useState("success")
  const [message, setMessage] = React.useState("")
  const [docid, setDocid] = React.useState("")
  const [docList, setDocList] = React.useState([])
  const [activeRowid, setActiveRowid] = React.useState()

  const { user, loading, userError } = useAuth()
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["appointments", openNotif],
    queryFn: fetchAppointments,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  })

  const details = useQuery({
    queryKey: ["details", isLoading],
    queryFn: fetchDetails,
  })
  async function fetchAppointments() {
    const apt = await getDocs(
      query(collection(db, "appointments"), where("hid", "==", hId), orderBy("reqtime", "desc"))
    )
    return apt.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      pname: "",
      phone: "",
      doc: "",
    }))
  }

  async function fetchDetails() {
    let detailsArr = []
    let docname = ""
    if (!isLoading && !error) {
      await Promise.all(
        data.map(async (row) => {
          const patRef = firestoreDoc(db, "publicusers", row.pid)
          const pat = await getDoc(patRef)
          if (row.drid != "") {
            const docRef = firestoreDoc(db, "doctors", row.drid)
            const doc = await getDoc(docRef)
            docname = doc.data().name
          }
          detailsArr.push({
            id: row.id + "@" + row.hid,
            pname: pat.data().name + "@" + pat.id,
            phone: pat.data().phone,
            symptoms: row.symptoms,
            dept: row.dept,
            onlinemode: row.onlinemode,
            doc: docname + "@" + row.dept,
            reqtime: row.reqtime,
            shldtime: row.shldtime,
            status: row.status,
          })
        })
      )
    }
    console.log(detailsArr)
    return detailsArr
  }

  const columns = [
    {
      field: "pname",
      headerName: "Patient name",
      width: "200",
      renderCell: (params) => {
        if (details.isLoading) return <Skeleton animation="wave" width={150} />
        return (
          <div>
            <a href={"/patients/" + params.value.split("@")[1]} target="_blank">
              {params.value.split("@")[0]}
            </a>
          </div>
        )
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => {
        if (details.isLoading) return <Skeleton animation="wave" width={150} />
        return <div>{params.value}</div>
      },
    },
    { field: "symptoms", headerName: "Symptoms", width: 150 },
    { field: "dept", headerName: "Dept", width: 100 },
    {
      field: "onlinemode",
      headerName: "Mode",
      width: 100,
      renderCell: (params) => {
        return <div>{params.value ? "Online" : "Offline"}</div>
      },
    },
    {
      field: "doc",
      headerName: "doctor",
      width: 150,
      renderCell: (params) => {
        if (details.isLoading) return <Skeleton animation="wave" width={150} />
        if (params.value.split("@")[0] == "")
          return (
            <div>
              <Button onClick={() => handleDocClickOpen(params)}>Appoint</Button>
            </div>
          )
        return <div>{params.value.split("@")[0]}</div>
      },
    },

    {
      field: "reqtime",
      headerName: "Requested On",
      width: 150,
      renderCell: (params) => {
        return <div>{dayjs(params.value.toDate()).format("DD/MM/YYYY HH:mm")}</div>
      },
    },
    {
      field: "shldtime",
      headerName: "Scheduled Time",
      width: 180,
      renderCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Test Time"
            value={dayjs(params.value.toDate())}
            onChange={(newValue) => {
              setActiveRowid(params.id.split("@")[0])
              setTestTime(newValue)
            }}
          />
        </LocalizationProvider>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => 
        params.value ? 
          <div>Scheduled</div>
        : 
          <Button variant="text" onClick={scheduleTest} startIcon={<CloudUploadIcon />}>
            Update schedule
          </Button>
        
    },
  ]

  function scheduleTest() {
    try {
      const testRef = firestoreDoc(db, "appointments", activeRowid)
      setDoc(testRef, { shldtime: testTime.toDate() }, { merge: true })
      setType("success")
      setMessage("Appointment scheduled successfully")
      setOpenNotif(true)
      refetch()
    } catch (err) {
      setType("error")
      setMessage("Error scheduling Appointment")
      setOpenNotif(true)
    }
  }

  const handleDocChange = (event) => {
    try {
      const apptRef = firestoreDoc(db, "appointments", activeRowid)
      setDoc(apptRef, { drid: docid }, { merge: true })
      setType("success")
      setMessage("Appointed doctor successfully")
      setOpenNotif(true)
      refetch()
      handleDocClose()
    } catch (err) {
      setType("error")
      setMessage("Error in Appointment")
      setOpenNotif(true)
    }
  }

  const handleDocClickOpen = async (props) => {
    setActiveRowid(props.id.split("@")[0])
    if (props.value.split("@")[1] != "") {
      const deptRef = query(
        collection(db, `users/${props.id.split("@")[1]}/departments`),
        where("name", "==", props.value.split("@")[1])
      )
      const doctors = await getDocs(deptRef)
      const doclist = []
      await Promise.all(
        doctors.docs[0].data().doctors.map(async (doc) => {
          const ref = firestoreDoc(db, "doctors", doc.uid)
          const docSnap = await getDoc(ref)
          doclist.push({ doctor: docSnap.data(), ...doc, deptName: props.value.split("@")[1] })
        })
      ).then(() => {
        setDocList(doclist)
        setOpen(true)
      })
    } else {
      const deptRef = collection(db, `users/${props.id.split("@")[1]}/departments`)
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
      setActiveRowid("")
      setOpen(false)
    }
  }

  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenNotif(false)
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
            <Paper
              sx={{ width: "100%", overflow: "hidden" }}
              style={{ margin: "1rem 5rem 1rem 5rem", backgroundColor: "#f9f9ff" }}
            >
              <Box sx={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={details.isLoading ? data : details.data}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  // pageSizeOptions={[5]}
                    // checkboxSelection
                    density="comfortable"
                    // pageSizeOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                />
              </Box>
            </Paper>
          </div>
          {/* Dialog for appointing doctor */}
          <Dialog disableEscapeKeyDown open={open} onClose={handleDocClose}>
            <DialogTitle>Select a doctor</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
                <FormControl sx={{ m: 1, width: "50vw" }}>
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
          <Notifications type={type} message={message} open={openNotif} handleClose={handleCloseNotif} />
        </>
      )}
    </>
  )
}
