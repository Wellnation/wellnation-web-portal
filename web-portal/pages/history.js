import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useQuery,QueryClient,QueryClientProvider } from 'react-query';
import { collection, getDocs, where, getDoc, doc, query } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { db } from '@/lib/firebase.config';
import { useAuthStore } from '@/lib/zustand.config';
import {Loader} from '@/components/utils';
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          {row.name}
        </TableCell>
        <TableCell align="right">{row.PatientName}</TableCell>
        <TableCell align="right">{row.Date}</TableCell>
        <TableCell align="right">{row.Time}</TableCell>
        <TableCell align="right">{row.Tests}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Patient History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    PatientName: PropTypes.string.isRequired,
    Date: PropTypes.string.isRequired,
    Time: PropTypes.string.isRequired,

    Tests: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.number.isRequired,
      }),
    ).isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        Name: PropTypes.string.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired
  }).isRequired,
};

const columns = [
  { id: 'patientHist', label: 'Patient history', minWidth: 10 },
  { id: 'patient', label: 'Patient name', minWidth: 10 },
  {
    id: 'Date',
    label: 'Date',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Time',
    label: 'Time',
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Tests',
    label: 'Tests',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
];

const rows = []

export default function History() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoad, setIsLoad] = React.useState(true);
  const [err, setError] = React.useState(null);
  const [auth,setAuth] = React.useState(true);

  const { user, loading } = useAuthStore();
  
    const { isLoading, error, data } = useQuery({
      queryKey: ['tests'],
      queryFn: fetchtests,
    });
  
    async function fetchtests() {
      // console.log(user)
      const hDoc = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
      console.log(hDoc.docs)
      const tests = await getDocs(query(collection(db, "tests"), where("hId", "==", hDoc.docs[0].id)));
      return tests;
      }

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
      }}>
          <Paper sx={{ width: '80%', overflow: 'hidden' }} style={{ margin: "1rem 5rem 1rem 5rem" }}>
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
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <Row key={row.name} row={row} />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
    );
}

