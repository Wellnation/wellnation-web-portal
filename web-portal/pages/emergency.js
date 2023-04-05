import * as React from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import TablePagination from "@mui/material/TablePagination"
import { useQuery } from "react-query"
import { collection, getDocs, onSnapshot, getDoc, doc as firestoreDoc } from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import { useAuth } from "@/lib/zustand.config"
import { NotUser, Loader } from "@/components/utils"

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${row.location.latitude},${row.location.longitude}`;
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">{row.name}</TableCell>
        <TableCell component="th" scope="row">{row.phone}</TableCell>
        <TableCell align="right">{row.date.toDate().toDateString() + " at " + row.date.toDate().toLocaleTimeString("en-us")}</TableCell>
        <TableCell align="right"><a href={mapUrl} target="_blank">View in maps</a></TableCell>
        <TableCell align="right">{row.status ? "Accepted" : "Pending"}</TableCell>
        <TableCell align="right"><a href={"/patients/" + row.pid} target="_blank">View details</a></TableCell>
      </TableRow>
    </React.Fragment>
  )
}

const columns = [
  { id: "name", label: "Patient name", minWidth: 100 },
  { id: "phone", label: "Patient phone", minWidth: 100 },
  {
    id: "date",
    label: "Time of emergency",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
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
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const emergencyCollection = collection(db, 'emergency');
        const data = [];
        const unsubscribe = onSnapshot(emergencyCollection, async (snapshot) => {
          await Promise.all(
            snapshot.docs.map(async (doc) => {
              const pt = await getDoc(firestoreDoc(db, 'publicusers', doc.data().pid));
              data.push({ ...doc.data(), ...pt.data(), id: doc.id });
            })
          );
          setData(data);
          setIsLoading(false);
        });
        return () => unsubscribe();
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
