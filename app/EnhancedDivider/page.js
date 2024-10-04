"use client"

import React from 'react';
import { Box, useTheme } from '@mui/material';

const EnhancedDivider = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        my: 8,
        position: 'relative',
        height: '1px',
        width: '100%',
        backgroundColor: theme.palette.divider,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '50%',
          height: '100%',
          background: `linear-gradient(90deg, 
            transparent,
            ${theme.palette.primary.main}40,
            ${theme.palette.primary.main},
            ${theme.palette.primary.main}40,
            transparent
          )`,
          animation: 'pulse 3s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 0.2,
              transform: 'translateX(-50%) scaleX(0.5)',
            },
            '50%': {
              opacity: 1,
              transform: 'translateX(-50%) scaleX(1)',
            },
          },
        }}
      />
    </Box>
  );
};

export default EnhancedDivider;