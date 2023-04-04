import * as React from "react"
import { styled } from "@mui/material/styles"
import PropTypes from "prop-types"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useQuery } from "react-query"
import { collection, getDocs, where, query, getDoc, doc as firestoreDoc, setDoc} from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import { useAuth } from "@/lib/zustand.config"
import { NotUser, Loader } from "@/components/utils"
import {
  ListItem,
  ListItemText,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  Fab,
  TextField,
  Button,
} from "@mui/material"
import Notifications from "@/components/Notifications"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: "100%",
}))

function Row(props) {
  const { row, rowid, func} = props
  const [open, setOpen] = React.useState(false)
  const [testTime, setTestTime] = React.useState(dayjs())
  const [openNotif, setOpenNotif] = React.useState(false)
  const [type, setType] = React.useState("success")
  const [message, setMessage] = React.useState("")
  const handleCloseNotif = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenNotif(false)
  }

  function scheduleTest() {
    try {
      const testRef = firestoreDoc(db, "testHistory", rowid)
      setDoc(testRef, { shldtime: testTime.toDate(), status: true }, { merge: true })
      setType("success")
      setMessage("Appointment scheduled successfully")
      setOpenNotif(true)
      func()
    }
    catch (err) {
      setType("error")
      setMessage("Error scheduling Appointment")
      setOpenNotif(true)
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <a href={"/patients/" + row.pid} target="_blank">{row.name}</a>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.phone}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.symptoms}
        </TableCell>
        <TableCell align="right">
          {row.reqtime.toDate().toDateString() + " at " + row.reqtime.toDate().toLocaleTimeString("en-us")}
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
        <TableCell align="right">{row.status ? "Scheduled" : <Button
            variant="text"
            onClick={scheduleTest}
            startIcon={<CloudUploadIcon />}
          >
            Update schedule
          </Button>}</TableCell>
      </TableRow>
      <Notifications type={type} message={message} open={openNotif} handleClose={handleCloseNotif} />
    </React.Fragment>
  )
}

const columns = [
  { id: "pname", label: "Patient name", minWidth: 200 },
  { id: "phone", label: "Phone", minWidth: 150 },
  { id: "symptoms", label: "symptoms", minWidth: 150 },
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

export default function History() {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openTest, setOpenTest] = React.useState(false)
  const hId = localStorage.getItem("hId")

  const { user, loading, userError } = useAuth()
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["tests"],
    queryFn: fetchtests,
  })

  async function fetchtests() {
      const data = []
      const apt = await getDocs(query(collection(db, "appointments"), where("hid", "==", hId)))
      await Promise.all(
          apt.docs.map(async (doc) => {
              const pat = await getDoc(firestoreDoc(db, "publicusers", doc.data().pid))
              data.push({ ...doc.data(), ...pat.data() })
          })
      )
        return data
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
                      return <Row key={index} row={row} rowid={row.id} func={refetch} />
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
          >
            </div>
        </>
      )}
    </>
  )
}
