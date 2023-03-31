import * as React from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { useAuth } from "@/lib/zustand.config"
import { Avatar, Button, TextField } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CancelIcon from "@mui/icons-material/Cancel"
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AttachFileIcon from "@mui/icons-material/AttachFile"
import { logout } from "./api/auth"
import { Loader } from "@/components/utils"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { collection, doc, getDocs, query, updateDoc, where, GeoPoint } from "firebase/firestore"
import { db } from "@/lib/firebase.config"
import Notifications from "@/components/Notifications"
import { updatePassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase.config"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: "100%",
}))

const Account = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const hospitalId = localStorage.getItem("hId")
  const [displayName, setDisplayName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState("error")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [oldPass, setOldPass] = React.useState("")
  const [pass, setPass] = React.useState("")
  const [rePass, setRePass] = React.useState("")
  const [checkPass, setCheckPass] = React.useState(false)

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery("userData", async () => {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", user.email)))
    const id = querySnapshot.docs[0].id
    const queryData = querySnapshot.docs[0].data()
    return { id, ...queryData }
  })

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await updateDoc(doc(db, "users", hospitalId), {
        address,
        phone,
        name: displayName,
      })
      updateProfile(auth.currentUser, {
        phoneNumber: phone,
        displayName: displayName,
      })
      console.log(user)
      setType("success")
      setErrorMessage("Profile updated successfully!")
      setOpen(true)
    } catch (err) {
      setType("error")
      setErrorMessage(err.message)
      setOpen(true)
    }
  }

  function location(e) {
    e.preventDefault()
    const location = navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await updateDoc(doc(db, "users", hospitalId), {
            location: new GeoPoint(position.coords.latitude, position.coords.longitude),
          })
          setType("success")
          setErrorMessage("Location updated successfully!")
          setOpen(true)
        } catch (err) {
          setType("error")
          console.log(err)
          setErrorMessage(err.message)
          setOpen(true)
        }
      },
      (error) => {
        setType("error")
        console.log(err)
        setErrorMessage(err.message)
        setOpen(true)
      }
    )
  }

  const handleChangePass = async (e) => {
    try {
      e.preventDefault()
      checkPass && (await updatePassword(user, rePass))
      setType("success")
      setErrorMessage("Password updated successfully!")
      setOpen(true)
    } catch (err) {
      setType("error")
      setErrorMessage(err.message)
      setOpen(true)
    }
  }

  const handleCancel = () => {
    setAddress("")
    setPhone("")
    setDisplayName("")
    setPass("")
    setRePass("")
    setOldPass("")
  }

  if (loading || isLoading) {
    return <Loader />
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>
  }

  return (
    <div
      style={{
        padding: "50px 30px",
      }}
    >
      <Notifications open={open} handleClose={handleClose} type={type} message={errorMessage} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} style={{ paddingBottom: "30px" }}>
          <Grid xs={12} sm={6}>
            <Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{ m: 1, bgcolor: "secondary.main" }}
                  src={"https://www.w3schools.com/howto/img_avatar.png"}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />
                <h1>Account Details</h1>
              </div>
              <div
                style={{
                  padding: "10px 30px",
                }}
              >
                <p>
                  <b>User Name:</b> {user?.displayName}
                </p>
                <p>
                  <b>Email:</b> {user?.email}
                </p>
                <p>
                  <b>Phone:</b> {user?.phoneNumber}
                </p>
                <p>
                  <b>Account Created On:</b> {userData.createdOn.toDate().toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    router.push("/dashboard")
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => {
                    logout()
                  }}
                >
                  Logout
                </Button>
              </div>
            </Item>
          </Grid>
          <Grid xs={12} sm={6}>
            <Item>
              <div
                style={{
                  padding: "10px 30px",
                }}
              >
                <h1>Edit Account Details</h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    placeholder={userData.name}
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value)
                    }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Phone Number"
                    variant="outlined"
                    placeholder={userData.phone}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                    }}
                  />
                  <TextField
                    id="outlined-textarea"
                    label="Address"
                    placeholder={userData.address}
                    multiline
                    variant="outlined"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button variant="text" color="primary" startIcon={<CloudUploadIcon />} onClick={handleSubmit}>
                      Update
                    </Button>
                    <Button variant="text" color="error" startIcon={<CancelIcon />} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                  <Button startIcon={<AddLocationIcon/>} onClick={location}>Update location</Button>
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
        <Item>
          <div
            style={{
              padding: "10px 30px",
            }}
          >
            <h1>Change Password</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Current Password"
                variant="outlined"
                type="password"
                onChange={(e) => {
                  setOldPass(e.target.value)
                }}
              />
              <TextField
                id="outlined-basic"
                label="New Password"
                variant="outlined"
                type="password"
                onChange={(e) => {
                  setPass(e.target.value)
                }}
              />
              <TextField
                id="outlined-basic"
                label="Confirm Password"
                variant="outlined"
                type="password"
                onChange={(e) => {
                  setRePass(e.target.value)
                  if (e.target.value === pass) {
                    setCheckPass(true)
                  } else {
                    setCheckPass(false)
                  }
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleChangePass}
                  disabled={!checkPass}
                >
                  Update
                </Button>
                <Button variant="text" color="error" startIcon={<CancelIcon />} onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Item>
      </Box>
    </div>
  )
}

export default Account
