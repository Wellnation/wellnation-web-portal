import * as React from "react"
import { styled } from "@mui/material/styles"
import {
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  OutlinedInput,
  FormControl,
  Select,
  DialogActions,
  IconButton,
} from "@mui/material"
import { AddCircleOutline } from "@mui/icons-material"
import {
  collection,
  getDocs,
  where,
  query,
  getDoc,
  doc as firestoreDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import Notifications from "@/components/Notifications"
import { useQuery } from "react-query"

export default function AlignItemsList(props) {
  const [medname, setMedname] = React.useState("")
  const [medprice, setMedprice] = React.useState("")
  const [docModal, setDocModal] = React.useState(false)
  const [docid, setDocid] = React.useState("")
  const [docname, setDocname] = React.useState("")
  const [docList, setDocList] = React.useState([])
  const [remark, setRemark] = React.useState("")
  const [openNotif, setOpenNotif] = React.useState(false)
  const [type, setType] = React.useState("success")
  const [message, setMessage] = React.useState("")
  const [testname, setTestname] = React.useState("")
  const [testid, setTestid] = React.useState("")
  const [testprice, setTestprice] = React.useState("")

  const tests = useQuery(
    "tests",
    async () => {
      const testRef = query(collection(db, "tests"), where("hid", "==", props.hId))
      const testSnap = await getDocs(testRef)
      return testSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    }
    // {
    //   enabled: props.hId !== "",
    // }
  )

  const handleAddTest = async () => {
    try {
      await setDoc(firestoreDoc(collection(db, "testHistory")), {
        tid: testid,
        tname: testname,
        reqtime: new Date(),
        shldtime: new Date(),
        status: false,
        attachment: "",
        hid: props.hId,
        hname: props.hName,
        patientId: props.pId,
        pName: props.pName,
      })

      const newTest = {
        price: testprice,
        testid: testid,
        type: testname,
      }
      const bedRef = firestoreDoc(db, `admissions/${props.admissionId}/logs`, props.log.id)
      await updateDoc(bedRef, {
        tests: arrayUnion(newTest),
      })
      setType("success")
      setMessage("Added test successfully")
      setOpenNotif(true)
      props.refetchFunc()
    } catch (err) {
      setType("error")
      setMessage("Error in adding test")
      setOpenNotif(true)
    }
  }

  async function addMeds() {
    if (medname === "" || medprice === "") return
    const newMed = {
      name: medname,
      price: medprice,
    }
    const bedRef = firestoreDoc(db, `admissions/${props.admissionId}/logs`, props.log.id)
    await updateDoc(bedRef, {
      meds: arrayUnion(newMed),
    })
    setMedname("")
    setMedprice("")
    props.refetchFunc()
  }

  function addVisits() {
    const handleDocChange = async (event) => {
      console.log(docid)
      try {
        const bedRef = firestoreDoc(db, `admissions/${props.admissionId}/logs`, props.log.id)
        await updateDoc(bedRef, {
          doctors: arrayUnion({
            dId: docid,
            doctorName: docname,
            remark: remark,
            time: new Date(),
          }),
        })
        setType("success")
        setMessage("Added visit successfully")
        setOpenNotif(true)
        handleDocClose()
        props.refetchFunc()
      } catch (err) {
        setType("error")
        setMessage("Error in adding visit")
        setOpenNotif(true)
      }
    }

    const handleDocClickOpen = async () => {
      const deptRef = collection(db, `users/${props.hId}/departments`)
      const doctors = await getDocs(deptRef)
      const doclist = []
      for (const doc of doctors.docs) {
        for (const doctor of doc.data().doctors) {
          const docSnap = await getDoc(firestoreDoc(db, `doctors`, doctor.uid))
          doclist.push({ doctor: docSnap.data(), deptName: doc.data().name, ...doctor })
        }
      }
      setDocList(doclist)
      setDocModal(true)
    }

    const handleDocClose = (event, reason) => {
      if (reason !== "backdropClick") {
        setDocModal(false)
      }
    }
    return (
      <div>
        <Button variant="text" startIcon={<AddCircleOutline />} style={{ margin: "1rem" }} onClick={handleDocClickOpen}>
          Add more visits
        </Button>
        <Dialog disableEscapeKeyDown open={docModal} onClose={handleDocClose}>
          <DialogTitle>Select the doctor</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Doctors lists</InputLabel>
                <Select
                  native
                  value={docname}
                  onChange={(event) => {
                    setDocid(event.target.value.split("@")[0])
                    setDocname(event.target.value.split("@")[1])
                  }}
                  input={<OutlinedInput label="Doctor" id="demo-dialog-native" />}
                >
                  <option aria-label="None" value="" />
                  {docList.map((doc) => {
                    return (
                      <option value={doc.uid + "@" + doc.doctor.name}>
                        ({doc.deptName}) {doc.doctor.name}
                      </option>
                    )
                  })}
                </Select>
                <TextField
                  id="filled-textarea"
                  label="Doctor's Remarks"
                  placeholder={remark}
                  multiline
                  variant="filled"
                  value={remark}
                  onChange={(event) => setRemark(event.target.value)}
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDocClose}>Cancel</Button>
            <Button onClick={handleDocChange}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
              <Typography variant="overline" style={{ margin: "1rem" }}>
                Doctors visited and remarks:
              </Typography>
              {props.log.doctors.map((doctor, index) => (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={doctor.doctorName.split(" ")[1]} src="#" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={doctor.doctorName}
                      secondary={
                        <React.Fragment>
                          {/* <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                    {Date(doctor.time).toLocaleString() + " :- "}
                  </Typography> */}
                          {doctor.remark}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
              {addVisits()}
            </List>
          </Grid>
          <Grid item xs>
            <Typography variant="overline" style={{ margin: "2rem 1rem 1rem 0" }}>
              Medcines :
            </Typography>
            <ul>
              {props.log.meds.map((med, index) => (
                <li key={index}>{med.name}</li>
              ))}
              <li>
                <TextField
                  id="filled-basic"
                  label="Add meds"
                  variant="filled"
                  value={medname}
                  onChange={(e) => setMedname(e.target.value)}
                />
                <TextField
                  id="filled-basic"
                  label="price"
                  variant="standard"
                  value={medprice}
                  onChange={(e) => setMedprice(e.target.value)}
                />
                <br />
                <Button startIcon={<AddCircleOutline />} color="success" onClick={() => addMeds()}>
                  Meds
                </Button>
              </li>
            </ul>
          </Grid>
          <Grid item xs>
            <Typography variant="overline" style={{ margin: "2rem 1rem 1rem 0" }}>
              Tests done on this day:
            </Typography>
            <ul>
              {props.log.tests.map((test, index) => (
                <li key={index}>
                  {test.type} : {test.price}
                </li>
              ))}
              <li>
                <Select
                  native
                  value={testname}
                  onChange={(event) => {
                    setTestid(event.target.value.split("@")[0])
                    setTestname(event.target.value.split("@")[1])
                    setTestprice(event.target.value.split("@")[2])
                  }}
                  input={<OutlinedInput label="Select Test" id="demo-dialog-native" />}
                >
                  <option aria-label="None" value="" />
                  {!tests.isLoading &&
                    tests.data.map((test) => {
                      return (
                        <option value={test.id + "@" + test.testname + "@" + test.testprice}>{test.testname}</option>
                      )
                    })}
                </Select>
                <Button startIcon={<AddCircleOutline />} onClick={handleAddTest}>
                  Tests
                </Button>
              </li>
            </ul>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
