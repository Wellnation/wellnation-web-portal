import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Image from 'next/image';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="/">
        WellNation
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <div
          style={{
            display: 'flex',
            flexWrap: 1
          }}
        >
        <Image
          src="/icon-light-2.svg"
          width={40}
          height={40}
          alt="Hospital Logo"
          style={{
            paddingRight: '10px',
          }}
        />
        <Typography 
          variant="body1"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          WELLNATION
        </Typography>
        </div>
        <Copyright />
      </Container>
    </Box>
  );
}