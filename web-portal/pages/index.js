import React from 'react';
import { db } from '@/lib/firebase.config';
import { collection, query, getDocs, doc as firestoreDoc, getDoc, where } from "firebase/firestore";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { useAuthStore } from '@/lib/zustand.config';

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
    type: 'string',
    width: 110,
    // editable: true,
  },
];

const Home = () => {
  const { user, loading, userError } = useAuthStore();
  // const { data: appointments, isLoading, error } = useQuery('appointments', async () => {
  //   const querySnap = await getDocs(collection(db, 'users'), where('email', '==', user.email));
  //   const hospitalId = querySnap.docs[1].id;
  //   const querySnapshot = await getDocs(query(collection(db, 'appointments'), where('hospital', '==', hospitalId)));
  //   const appointmentsData = await Promise.all(
  //     querySnapshot.docs.map(async (doc) => {
  //       const appointmentData = doc.data();
  //       const userDoc = await getDoc(firestoreDoc(db, 'users', appointmentData.hospital));
  //       const doctorName = userDoc.data().doctors.find((doctor) => doctor.id === appointmentData.doctor).name;
  //       return { id: doc.id, ...appointmentData, hospitalName: userDoc.data().name, doctorName: doctorName };
  //     })
  //   );
  //   return appointmentsData;
  // });
  const [appointmentData, setAppointmentData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const getAppointmentData = async () => {
      try {
        const querySnap = await getDocs(collection(db, 'users'), where('email', '==', user.email));
        const hospitalId = querySnap.docs[1].id;
        const querySnapshot = await getDocs(query(collection(db, 'appointments'), where('hospital', '==', hospitalId)));
        const appointmentsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const appointmentData = doc.data();
            const userDoc = await getDoc(firestoreDoc(db, 'users', appointmentData.hospital));
            const doctorName = userDoc.data().doctors.find((doctor) => doctor.id === appointmentData.doctor).name;
            return { id: doc.id, ...appointmentData, hospitalName: userDoc.data().name, doctorName: doctorName };
          })
        );
        setAppointmentData(appointmentsData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }

    getAppointmentData();
  }, [user.email]);

  if (isLoading) return <p>Loading...</p>;

  if (error) { 
    return (
      <div>
        An error occurred: {error.message}<br />
        {user.email}
      </div>
    );
  }

  return (
    <>
      <h1>Appointments</h1>
      {user.email}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px'
        }}
      >
        <Box sx={{ height: 400, width: '80%' }}>
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
    </>
  )
}

export default Home