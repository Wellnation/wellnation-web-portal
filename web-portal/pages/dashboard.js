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
  Typography,
  IconButton,
} from '@mui/material';
import { MailRounded } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/lib/zustand.config';
import { useQuery } from 'react-query';
import { getDoc, doc as firestoreDoc, arrayUnion, updateDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { Loader } from '@/components/utils';
import { db } from '@/lib/firebase.config';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Notifications from '@/components/Notifications';
import { Item } from './home';

const AddDoctorDialog = (props) => {
  const { onClose, selectedValue, open, depId, func } = props;
  const [docEmail, setDocEmail] = React.useState('');
  const [arrTime, setArrTime] = React.useState(dayjs());
  const [depTime, setDepTime] = React.useState(dayjs());
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
    func();
    setDocEmail('');
    setArrTime(dayjs());
    setDepTime(dayjs());
    onClose(selectedValue);
  };

  const handleUpload = async () => {
    try {
      const hospitalId = localStorage.getItem('hId');
      const docRef = firestoreDoc(db, `users/${hospitalId}/departments`, depId);
      const colSnap = await getDocs(query(collection(db, 'doctors'), where('email', '==', docEmail)));

      if (colSnap.docs.length === 0) {
        throw new Error('Doctor Not Found');
      }

      const docId = colSnap.docs[0].data().uid;
      const doctorsList = (await getDoc(docRef)).data().doctors;

      if (doctorsList.find((doctor) => doctor.uid === docId)) {
        throw new Error('Doctor Already Added');
      }

      const newDoctor = {
        arrTime: arrTime.toDate(),
        depTime: depTime.toDate(),
        uid: docId
      };

      await updateDoc(docRef, {
        doctors: arrayUnion(newDoctor),
      });

      setType('success');
      setMessage('Doctor Added Successfully');
      setOpenNotif(true);
      setDocEmail('');
      setArrTime(dayjs());
      setDepTime(dayjs());
      func();
      setTimeout(() => {
        onClose(selectedValue)
      }, 2000);
    } catch (error) {
      console.log(error);
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
          type='email'
          label="Email"
          variant="outlined"
          value={docEmail}
          onChange={(e) => {
            setDocEmail(e.target.value);
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Arr Time"
            value={arrTime}
            onChange={(newValue) => {
              setArrTime(newValue);
            }}
          />
          <DateTimePicker
            label="Dep Time"
            value={depTime}
            onChange={(newValue) => {
              setDepTime(newValue);
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

const AddDepDialog = (props) => {
  const { onClose, selectedValue, open, func } = props;
  const [depName, setDepName] = React.useState('');
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
    setDepName('');
    onClose(selectedValue);
    func();
  };

  const handleUpload = async () => {
    try {
      const hospitalId = localStorage.getItem('hId');
      const colRef = collection(db, `users/${hospitalId}/departments`);

      await addDoc(colRef, {
        name: depName,
        doctors: [],
      });

      setType('success');
      setMessage('Department Added Successfully');
      setOpenNotif(true);
      setDepName('');
      func();
      setTimeout(() => {
        onClose(selectedValue)
      }, 2000);
    } catch (error) {
      console.log(error);
      setType('error');
      setMessage(error.message);
      setOpenNotif(true);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Department</DialogTitle>
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
          label="Department Name"
          variant="outlined"
          value={depName}
          onChange={(e) => {
            setDepName(e.target.value);
          }}
        />
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
            Add Department
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
  const [openDep, setOpenDep] = React.useState(false);
  const [depId, setDepId] = React.useState('');
  const hospitalId = localStorage.getItem('hId');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", hospitalId],
    queryFn: async () => {
      const colSnap = await getDocs(collection(db, `users/${hospitalId}/departments`));
      const depData = []
      for (const doc of colSnap.docs) {
        const docData = [];
        for (const doctor of doc.data().doctors) {
          const docSnap = await getDoc(firestoreDoc(db, `doctors`, doctor.uid));
          docData.push({ name: docSnap.data().name, email: docSnap.data().email, ...doctor });
        }
        depData.push({ id: doc.id, ...doc.data(), doctors: docData });
      }
      return depData;
    }
  });

  if (isLoading || loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

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
          padding: '30px',
        }}
      >
        <h1>Dashboard</h1>
        <h3>Logged in as: {user.displayName}</h3>
        <div>
          <h1>Departments</h1>
          {!data ? <h3>No Departments Added</h3> :
            data.map((dep) => (
              <div key={dep.id}>
                <h1>{dep.name}</h1>
                <h2>Doctors</h2>
                {dep.doctors.length === 0 ? <h3>No Doctors Added</h3> :
                dep.doctors.map((doc) => (
                  <ListItem
                    key={doc.uid}
                    secondaryAction={
                      <div>
                        <IconButton>
                          <EditIcon style={{ marginRight: '20px' }} />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant='h5'>
                          {doc.name}
                          <IconButton
                            component={'a'}
                            href={`mailto:${doc.email}`}
                            style={{
                              marginLeft: '20px',
                            }}
                          >
                            <MailRounded />
                          </IconButton>
                        </Typography>
                      }
                      secondary={
                        <div>
                          <table>
                            <tr>
                              <th>Arr Time: </th>
                              <td>{doc.arrTime.toDate().toLocaleString()}</td>
                            </tr>
                            <tr>
                              <th>Dep Time: </th>
                              <td>{doc.depTime.toDate().toLocaleString()}</td>
                            </tr>
                          </table>
                        </div>
                      }
                    />
                  </ListItem>
                ))}
                <Button
                  variant="text"
                  color="primary"
                  style={{
                    marginTop: '20px',
                  }}
                  onClick={() => {
                    setDepId(dep.id);
                    setOpen(true);
                  }}
                >
                  Add Doctor
                </Button>
              </div>
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
        onClick={() => setOpenDep(true)}
      >
        <AddIcon />
      </Fab>
      <AddDoctorDialog open={open} onClose={() => setOpen(false)} depId={depId} func={refetch} />
      <AddDepDialog open={openDep} onClose={() => setOpenDep(false)} func={refetch} />
    </div>
  )
}

export default Dashboard