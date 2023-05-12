import React from 'react'
import { Button, Paper, styled } from '@mui/material'
import { useSocket } from '@/lib/zustand.config';
import { useRouter } from 'next/router';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: '100%',
}));

const VideoRoom = () => {
  const { io } = useSocket();
  const { asPath } = useRouter();
  const roomId = asPath.split('/')[3];
  const patientId = "A9FU5zycZ7NldUhJgQbn2rHs6sF3";

  const handleJoin = () => {
    io.emit('join-room', { roomId, userId: patientId });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 30px',
      }}
    >
      <h1>Video Room</h1>
      <Item
        elevation={2}
        style={{
          padding: '30px',
        }}
      >
        <h3>Video Room</h3>
        <Button onClick={handleJoin}>Join Room</Button>
      </Item>
    </div>
  )
}

export default VideoRoom