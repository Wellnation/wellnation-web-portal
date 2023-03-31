import React from 'react';
import { db } from '@/lib/firebase.config';
import { collection, query, getDocs, doc as firestoreDoc, getDoc, where } from "firebase/firestore";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {Loader} from '@/components/utils';

const columns = [
  { 
    field: 'type', 
    headerName: 'Room Type', 
    width: 200 
  },
  {
    field: 'capacity',
    headerName: 'Capacity',
    type: 'number',
      width: 100,
  },
  {
    field: 'total',
    headerName: 'Total Rooms',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    type: 'number',
      width: 110,
    editable: true,
  },
  {
    field: 'currAvail',
    headerName: 'Available Rooms',
    type: 'number',
      width: 110,
    editable: true,
  },
];

const DataUpdate = () => {
  const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [roomsData, setRoomsData] = React.useState([]);
  
  const hId = localStorage.getItem('hId');

  React.useEffect(() => {
    const getAppointmentData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'rooms'), where('hospital', '==', hId)));
        setRoomsData(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
    getAppointmentData();
  }, []);

  if (isLoading) return <Loader />;

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
        Rooms
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
            rows={roomsData}
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

export default DataUpdate;