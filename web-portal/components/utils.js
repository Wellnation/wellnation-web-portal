import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router'

function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress/>
    </div>
  );
}

function NotUser() {
  const router = useRouter()
  function handleredirect() {
    router.push("/login")
  }
  return (
    <>
    {handleredirect()}
    </>
  );
}

export {Loader, NotUser}