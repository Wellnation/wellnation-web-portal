import React from 'react'
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
  Container,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { resetPassword } from './api/auth'
import Notifications from '@/components/Notifications'
import { useRouter } from 'next/router'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        WellNation
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const reset = () => {
  const [password, setPassword] = React.useState('')
  const [rePassword, setRePassword] = React.useState('')
  const [checkPass, setCheckPass] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [type, setType] = React.useState('error')
  const router = useRouter();
  const code = router.query['oobCode'];
  
  const handleSubmit = (event) => {
    event.preventDefault()
    // console.log(code, typeof(code))
    resetPassword(code, rePassword, setOpen, setErrorMessage, setType);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
						<Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="check-password"
              label="Retype Password"
              type="password"
              id="check-password"
              autoComplete="new-password"
              onChange={(e) => {
                setRePassword(e.target.value);
                if (e.target.value === password) {
                  setCheckPass(true);
                } else {
                  setCheckPass(false);
                }
              }}
            />
            </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!checkPass}
            >
              Confirm Password Reset
            </Button>
            <Notifications open={open} type={type} message={errorMessage} handleClose={handleClose} />
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </div>
  )
}

export default reset