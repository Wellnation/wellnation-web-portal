import React from 'react'
import { styled } from '@mui/material/styles';
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useAuth } from '@/lib/zustand.config';
import { useQuery } from 'react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Loader } from '@/components/utils';
import { db } from '@/lib/firebase.config';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: '100%',
}));

const DoctorHome = () => {
  const { user, loading } = useAuth();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { data: appointments, isLoading, error } = useQuery('appointments', async () => {
    const q = query(collection(db, 'appointments'), where('drid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const appointmentData = [];
    querySnapshot.docs.map((doc) => {
      appointmentData.push({ id: doc.id, ...doc.data() });
    });
    console.log(appointmentData);
    return appointmentData;
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
        <h1>Appointments</h1>
        <h3>Logged in as: {user.displayName}</h3>
        <div>
          {appointments.length === 0 ? (
            <h3>No appointments</h3>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id}>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '50%', flexShrink: 0 }}>
                    Patient Name: {appointment.pid}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Scheduled Time: {appointment.shldtime.toDate().toLocaleString()}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={4}>
                    <ListItem>
                      <ListItemText 
                        primary="Symptoms"
                        secondary={appointment.symptoms}
                      />
                    </ListItem>
                    </Grid>
                    <Grid xs={12} sm={4}>
                    <ListItem>
                      <ListItemText
                        primary="Remarks"
                        secondary={appointment.remarks}
                      />
                    </ListItem>
                    </Grid>
                    <Grid xs={12} sm={4}>
                    <ListItem>
                      <ListItemText
                        primary="Medicines Prescribed"
                        secondary={appointment.medicine.map((medicine) => (
                          <div
                            key={medicine.name}
                          >
                            <p 
                              style={{
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <RadioButtonCheckedIcon /> {medicine.name}
                            </p>
                            <p
                              style={{
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <RadioButtonCheckedIcon /> {medicine.remark}
                            </p>
                          </div>
                        ))}
                      />
                    </ListItem>
                    </Grid>
                    </Grid>
                </AccordionDetails>
              </Accordion>
              </div>
            ))
          )}
        </div>
      </Item>
    </div>
  )
}

export default DoctorHome