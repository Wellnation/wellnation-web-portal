import React from 'react'
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { forgotPassword } from './api/auth'
import Notifications from '@/components/Notifications'

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

const forgot = () => {
  const [email, setEmail] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [type, setType] = React.useState('error')

  const handleSubmit = (event) => {
    event.preventDefault()
    forgotPassword(email, setOpen, setErrorMessage, setType)
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
            Send Password Reset Email
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Mail
            </Button>
            <Notifications open={open} type={type} message={errorMessage} handleClose={handleClose} />
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </div>
  )
}

export default forgot