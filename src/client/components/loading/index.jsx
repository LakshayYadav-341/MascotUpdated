import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function Loading({ style }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Stack the loader and message vertically
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Set the height to full viewport height
        ...style,
      }}
    >
      <CircularProgress />
      <Typography
        sx={{
          marginTop: 2,
          textAlign: 'center',
          color: 'gray',
          fontSize: '1.5rem',
        }}
      >
        The Node.js service deployed on Render has been stopped due to inactivity restrictions on free tier.<br />
        Please wait or retry after 2 minutes; it will restart.
      </Typography>
    </Box>
  );
}
