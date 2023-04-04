import React from 'react';
import { db } from '@/lib/firebase.config';
import { collection, query, getDocs, doc as firestoreDoc, getDoc, where } from "firebase/firestore";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '@/lib/zustand.config';
import {Loader, NotUser} from '@/components/utils';
import DataUpdate from '@/components/DataUpdate';

const columns = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 90 
  },
  {
    field: 'patient',
    headerName: 'Patient Name',
    type: 'string',
    width: 150,
  },
  {
    field: 'doctorName',
    headerName: 'Doctor Name',
    type: 'string',
    width: 150,
  },
  {
    field: 'hospitalName',
    headerName: 'Hospital Name',
    type: 'string',
    width: 110,
  },
  {
    field: 'cause',
    headerName: 'Cause',
    type: 'string',
    width: 110,
  },
  {
    field: 'time',
    headerName: 'Date',
    type: 'date',
    width: 110,
    valueGetter: (params) => {
      return params.row.time.toDate();
    },
  },
  {
    field: 'completed',
    headerName: 'Status',
    type: 'boolean',
    width: 110,
    // editable: true,
  },
];

const Home = () => {
  const { user, loading, userError } = useAuth();
  const [appointmentData, setAppointmentData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [auth, setAuth] = React.useState(true);
  
  const hId = localStorage.getItem('hId');

  React.useEffect(() => {
    const getAppointmentData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'appointments'), where('hospital', '==', hId)));
        const appointmentsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const appointmentData = doc.data();
            const doctor = await getDoc(firestoreDoc(db, 'doctors', appointmentData.doctor));
            const hospital = await getDoc(firestoreDoc(db, 'users', appointmentData.hospital));
            return { id: doc.id, ...appointmentData, hospitalName: hospital.data().name, doctorName: doctor.data().name };
          })
        );
        setAppointmentData(appointmentsData);
        setIsLoading(false);
      } catch (error) {
        console.log(error)
        setError(error);
        setIsLoading(false);
      }
    }
    !loading && !user && setAuth(false);
    !loading && user && getAppointmentData();
  }, [loading]);

  if(!auth) return <NotUser />;

  else if (isLoading) return <Loader />;

  else if (error) { 
    return (
      <div>
        An error occurred: {error.message}<br />
        {user.email}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px',
          fontWeight: 900,
          fontSize: '2.5rem'
        }}
      >
        Appointments
      </div>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px'
        }}
      >
        <Box sx={{ height: 300, width: '80%' }}>
          <DataGrid
            rows={appointmentData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            // checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
      <DataUpdate/>
    </>
  )
}

export default Home