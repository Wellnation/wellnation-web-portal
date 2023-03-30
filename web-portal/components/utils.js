import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router'



function Loader() {
  return (
      <CircularProgress/>
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