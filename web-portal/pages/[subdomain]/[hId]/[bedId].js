import * as React from "react"
import { styled } from "@mui/material/styles"
import { Box, Stepper, Step, StepButton, StepLabel, StepContent, Button, Paper, Typography } from "@mui/material"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { collection, getDocs, where, query, getDoc, doc as firestoreDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import { useAuth } from "@/lib/zustand.config"
import { Loader } from "@/components/utils"
import AdmissionLogs from "@/components/AdmissionLogs"
import { PlaylistAdd } from "@mui/icons-material"

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: "100%",
}))

export default function VerticalLinearStepper() {
  const router = useRouter()
  const hId = router.query.hId
  const bedId = router.query.bedId
  const [activeStep, setActiveStep] = React.useState(0)
  const [logsize, setLogsize] = React.useState(0)

  const bedInfo = useQuery({
    queryKey: ["bedInfo", bedId],
    queryFn: fetchBedInfo,
  })

  const admissionInfo = useQuery({
    queryKey: ["admissionInfo", hId],
    queryFn: fetchAdmissionInfo,
  })

  async function fetchBedInfo() {
    const bedRef = firestoreDoc(db, `users/${hId}/beds`, bedId)
    const bedDoc = await getDoc(bedRef)
    // console.log(bedDoc.data())
    return bedDoc.data()
  }

  async function fetchAdmissionInfo() {
    const admissionRef = query(collection(db, "admissions"), where("bedId", "==", bedId))
    const admissionSnapshot = await getDocs(admissionRef)
    if (admissionSnapshot.empty) return { admissionId: null, logs: [] }
    // logs
    const logsRef = collection(db, "admissions", admissionSnapshot.docs[0].id, "logs")
    const logsSnapshot = await getDocs(logsRef)
    const logs = logsSnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    setActiveStep(logs.length - 1)
    setLogsize(logs.length - 1)
    // patient
    const patientRef = firestoreDoc(db, "publicusers", admissionSnapshot.docs[0].data().pId)
    const patientDoc = await getDoc(patientRef)
    // console.log({ ...admissionSnapshot.docs[0].data(), admissionId: admissionSnapshot.docs[0].id, logs })
    return {
      ...admissionSnapshot.docs[0].data(),
      admissionId: admissionSnapshot.docs[0].id,
      logs,
      patient: patientDoc.data(),
    }
  }

  async function addLogs() {
    const logRef = collection(db, "admissions", admissionInfo.data.admissionId, "logs")
    const newid = firestoreDoc(logRef).id
    await setDoc(firestoreDoc(db, `admissions/${admissionInfo.data.admissionId}/logs`, newid), {
      logDate: new Date(),
      doctors: [],
      meds: [],
      tests: [],
    })
      .then(() => {
        admissionInfo.refetch()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      {bedInfo.isLoading || admissionInfo.isLoading ? (
        <Loader />
      ) : bedInfo.error || admissionInfo.error ? (
        <Typography variant="h6" style={{ fontWeight: "bold", margin: "20px" }}>
          This bed has been deleted or does not exist.
        </Typography>
      ) : (
        <Box
          sx={{
            maxWidth: "100vw",
            backgroundColor: "#f0f9ff",
            justifyContent: "space-around",
            alignItems: "center",
            margin: "2rem 5vw",
          }}
        >
          <Item
            elevation={1}
            style={{
              padding: "1rem 2rem",
              margin: "1rem 0",
            }}
          >
            <Typography variant="h6" style={{ fontWeight: "bold", margin: "20px" }}>
              Room No. : {bedInfo.data.roomNo}
              <br />
              Bed No. : {bedInfo.data.bedNo}
            </Typography>
            {bedInfo.data.status ? null : (
              <Typography variant="h6" style={{ margin: "0 20px" }}>
                <ul>
                  <li>Patient Name : {admissionInfo.data.patient.name}</li>
                  <li>Patient dob : {admissionInfo.data.patient.dob}</li>
                  <li>Date Admitted : {admissionInfo.data.dateAdmitted.toDate().toDateString()}</li>
                </ul>
              </Typography>
            )}
          </Item>
          {bedInfo.data.status ? (
            <Typography variant="h6" style={{ fontWeight: "bold", margin: "20px" }}>
              This bed is not occupied yet.
            </Typography>
          ) : (
            <>
              <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                {admissionInfo.data.logs.map((log, index) => (
                  <Step key={index}>
                    <StepButton color="inherit" onClick={() => setActiveStep(index)}>
                      {log.logDate.toDate().toDateString()}
                    </StepButton>
                    <StepContent>
                      <AdmissionLogs
                        log={log}
                        admissionId={admissionInfo.data.admissionId}
                        refetchFunc={admissionInfo.refetch}
                        hId={hId}
                      />
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {logsize != -1 &&
              admissionInfo.data.logs[logsize-1].logDate.toDate().toDateString() === new Date().toDateString() ? null : (
                <Button onClick={addLogs} sx={{ mt: 1, mr: 1 }} startIcon={<PlaylistAdd />} color="secondary">
                  Add new logs
                </Button>
              )}
            </>
          )}
        </Box>
      )}
    </>
  )
}
