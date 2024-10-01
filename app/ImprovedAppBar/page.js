"use client"
import React from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, useMediaQuery } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import MenuIcon from '@mui/icons-material/Menu';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: 'none',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 1rem',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

export default function ImprovedAppBar() {
  const router = useRouter();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mb:-2 }}>
          <Image src="/logo1.png" alt="Vaccinity AI Logo" width={165} height={85} priority />
        </Box>
        {isMobile ? (
          <IconButton edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NavButton onClick={() => router.push('/')}>Home</NavButton>
            <NavButton onClick={() => router.push('/dashboard')}>Dashboard</NavButton>
            <SignedOut>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => router.push('/sign-up')}
                sx={{ 
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
                }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
}