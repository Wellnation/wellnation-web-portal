import * as React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { getDoc, doc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import { Loader } from "@/components/utils"

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "transparent",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}))

export default function SimpleContainer() {
  const router = useRouter()
  const { pid } = router.query
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery("userData", async () => {
    const patient = await getDoc(doc(db, "publicusers", pid))
    const vitals = await getDoc(doc(doc(db, "publicusers", pid), "vitals", "info"))
    return { ...patient.data(), ...vitals.data() }
  })


  if (isLoading) return <Loader />
  if (error) return <div>Error</div>

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
        <Paper
          sx={{ bgcolor: "#cfe8fc", height: "auto" }}
          elevation={3}
          children={
            <Grid container style={{ padding: "1.5rem 1.5rem" }}>
              <Grid xs={16}>
                <Item>
                  <Avatar sx={{ bgcolor: blue[500] }} src="/broken-image.jpg" />
                </Item>
              </Grid>

              <Grid xs="12">
                <Item>
                  <b>Personal Details</b>
                </Item>
              </Grid>
              <Grid xs="6">
                <Item>Name: {userData.name}</Item>
              </Grid>
              <Grid xs="6">
                <Item>Email: {userData.email}</Item>
              </Grid>
              <Grid xs="6">
                <Item>Phone: {userData.phone}</Item>
              </Grid>
              <Grid xs="6">
                <Item>Emergency no.: {userData.emergencyNumber}</Item>
              </Grid>
              <Grid xs="6">
                <Item>DOB: {userData.dob}</Item>
              </Grid>
              <Grid xs="6">
                <Item>Gender: {userData.gender} </Item>
              </Grid>
              <Grid xs="12">
                <Item>
                  <b>Address</b>
                </Item>
              </Grid>
              <Grid xs="6">
                <Item>Locality:{userData.address.locality} </Item>
              </Grid>
              <Grid xs="6">
                <Item>District: {userData.address.district}</Item>
              </Grid>
              <Grid xs="6">
                <Item>State:{userData.address.state} </Item>
              </Grid>
              <Grid xs="6">
                <Item>Pin:{userData.address.pincode} </Item>
              </Grid>
              <Grid xs="12">
                <Item>
                  <b>Vitals</b>
                </Item>
              </Grid>
              <Grid xs="6">
                <Item>Birthmark:{userData.birthmark} </Item>
              </Grid>
              <Grid xs="6">
                <Item>Blood Group:{userData.bloodgroup} </Item>
              </Grid>
              <Grid xs="6">
                <Item>Height: {userData.height}</Item>
              </Grid>
              <Grid xs="6">
                <Item>Weight:{userData.weight} </Item>
              </Grid>
              <Grid xs="12">
                <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} style={{ backgroundColor: "transparent" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                    <Typography sx={{ width: "33%", flexShrink: 0, textAlign: "center" }}><b>Diseases History</b></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {
                        <ol>
                          {userData.diseases.map((disease) => (
                            <li>{disease}</li>
                          ))}
                        </ol>
                      }
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          }
        />
      </Container>
    </React.Fragment>
  )
}
