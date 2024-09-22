import React from 'react';
import { Box } from '@mui/material';

const EnhancedDivider = () => (
  <Box
    sx={{
      my: 8,
      position: 'relative',
      height: '4px',
      width: '100%',
      backgroundColor: 'rgba(140, 82, 255, 0.1)', // Very light purple background
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(90deg, transparent, #8C52FF, transparent)',
        animation: 'shimmer 2s infinite',
        '@keyframes shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      }}
    />
  </Box>
);

export default EnhancedDivider;