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
    </Box>
  );
}
