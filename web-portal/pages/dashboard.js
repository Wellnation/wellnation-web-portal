import React from 'react'
import { styled } from '@mui/material/styles';
import { 
  Dialog, 
  DialogTitle, 
  ListItem, 
  ListItemText, 
  Paper, 
  Fab,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/lib/zustand.config';
import { useQuery } from 'react-query';
import { getDoc, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import { Loader } from '@/components/utils';
import { db } from '@/lib/firebase.config';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Notifications from '@/components/Notifications';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: '100%',
}));

const AddDialog = (props) => {
  const { onClose, selectedValue, open } = props;
  const [docName, setDocName] = React.useState('');
  const [arrivalTime, setArrivalTime] = React.useState(dayjs());
  const [departureTime, setDepartureTime] = React.useState(dayjs());
  const [openNotif, setOpenNotif] = React.useState(false);
  const [type, setType] = React.useState('error');
  const [message, setMessage] = React.useState('');

  const handleCloseNotif = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenNotif(false);
  };

  const handleClose = () => {
    setDocName('');
    setArrivalTime(dayjs());
    setDepartureTime(dayjs());
    onClose(selectedValue);
  };

  const handleUpload = async () => {
    try {
      const hospitalId = localStorage.getItem('hId');
      const docRef = doc(db, 'users', hospitalId);
      const newDoctor = {
        name: docName,
        arrivalTime: arrivalTime.toDate(),
        departureTime: departureTime.toDate(),
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      };
      await updateDoc(docRef, {
        doctors: arrayUnion(newDoctor),
      });
      setType('success');
      setMessage('Doctor Added Successfully');
      setOpenNotif(true);
      setDocName('');
      setArrivalTime(dayjs());
      setDepartureTime(dayjs());
      setTimeout(() => {
        onClose(selectedValue)
      }, 2000);
    } catch (error) {
      setType('error');
      setMessage(error.message);
      setOpenNotif(true);
    }
  };


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Doctor Details</DialogTitle>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          width: '500px',
        }}
      >
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={docName}
          onChange={(e) => {
            setDocName(e.target.value);
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker 
              label="Arrival Time" 
              value={arrivalTime}
              onChange={(newValue) => {
                setArrivalTime(newValue);
              }}
            />
            <DateTimePicker
              label="Departure Time"
              value={departureTime}
              onChange={(newValue) => {
                setDepartureTime(newValue);
              }}
            />
        </LocalizationProvider>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: '10px',
          }}
        >
        <Button
          variant="text"
          onClick={handleUpload}
          startIcon={<CloudUploadIcon />}
        >
          Add Doctor Details
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
      <Notifications type={type} message={message} open={openNotif} handleClose={handleCloseNotif} />
    </Dialog>
  );
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = React.useState(false);
  const hospitalId = localStorage.getItem('hId');

  const { data, isLoading, error } = useQuery(
    'user',
    async () => {
      const queryDoc = await getDoc(doc(db, 'users', hospitalId));
      return queryDoc.data();
    }
  );

  if (isLoading || loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 30px',
      }}
    >
      <Item
        elevation={2}
        style={{
          padding: '10px 30px',
        }}
      >
        <h1>Dashboard</h1>
        <h3>Logged in as: {user.displayName}</h3>
        <div>
          <h1>Doctors</h1>
          { !data.doctors ? <h3>No Doctors Added</h3> :
            data.doctors.map((doc) => (
            <ListItem
              key={doc.id}
              secondaryAction={
                <div style={{
                  padding: '0 20px',
                }}>
                  <EditIcon style={{ marginRight: '20px' }} />
                  <DeleteIcon />
                </div>
              }
            >
              <ListItemText
                primary={doc.name}
                secondary={
                  <div>
                    <table>
                      <tr>
                        <th>Arrival Time: </th>
                        <td>{doc.arrivalTime.toDate().toLocaleString()}</td>
                      </tr>
                      <tr>
                        <th>Departure Time: </th>
                        <td>{doc.departureTime.toDate().toLocaleString()}</td>
                      </tr>
                    </table>
                  </div>
                }
              />
            </ListItem>
          ))}
        </div>
      </Item>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: '120px',
          right: '20px',
        }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <AddDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default Dashboard