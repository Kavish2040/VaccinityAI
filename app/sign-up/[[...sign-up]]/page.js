// app/sign-up/page.js

"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { SignUp } from '@clerk/nextjs';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
  Button,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PersonOutline, Business } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const ToggleButton = styled(Button)(({ theme, selected }) => ({
  flex: 1,
  borderRadius: '20px',
  color: selected ? '#FFFFFF' : '#B0B0B0',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : 'rgba(108, 99, 255, 0.1)',
  },
}));

export default function SignUpPage() {
  const [userType, setUserType] = useState('patient');
  const router = useRouter();
  const searchParams = useSearchParams();
  const condition = searchParams.get('condition') || '';
  
  useEffect(() => {
    console.log('SignUpPage: userType =', userType);
    console.log('SignUpPage: condition =', condition);
  }, [userType, condition]);


  // Log userType and condition for debugging
  useEffect(() => {
    console.log('SignUpPage: userType =', userType);
    console.log('SignUpPage: condition =', condition);
  }, [userType, condition]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Image src="/logo1.png" alt="VaccinityAI Logo" width={150} height={80} />
          </Box>
          <Button color="inherit" onClick={() => router.push('/')} sx={{ mr: 2 }}>
            Home
          </Button>
          <Button color="inherit" component={Link} href="/sign-in">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: 'background.paper',
          width: '100%',
          maxWidth: '450px',
          mx: 'auto',
        }}>
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Join VaccinityAI
          </Typography>
          <Box sx={{ display: 'flex', width: '100%', mb: 3 }}>
            <ToggleButton
              selected={userType === 'patient'}
              onClick={() => setUserType('patient')}
              startIcon={<PersonOutline />}
            >
              PATIENT
            </ToggleButton>
            <Box sx={{ width: '8px' }} />
            <ToggleButton
              selected={userType === 'pharmacy'}
              onClick={() => setUserType('pharmacy')}
              startIcon={<Business />}
            >
              PHARMACY
            </ToggleButton>
          </Box>
          {/* Added key={userType} to force re-render when userType changes */}
          <SignUp
            key={userType}
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl={`/complete-signup?userType=${encodeURIComponent(userType)}&condition=${encodeURIComponent(condition)}`}
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: theme.palette.primary.main,
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                card: {
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                },
                headerTitle: {
                  display: 'none',
                },
                headerSubtitle: {
                  display: 'none',
                },
                formFieldInput: {
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                },
                formFieldLabel: {
                  color: '#B0B0B0',
                },
                footerActionLink: {
                  color: theme.palette.primary.main,
                },
                formFieldInputShowPasswordButton: {
                  color: '#B0B0B0',
                },
                dividerLine: {
                  backgroundColor: '#333333',
                },
                dividerText: {
                  color: '#B0B0B0',
                },
                socialButtonsBlockButton: {
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: '#2A2A2A',
                  },
                },
                footerActionText: {
                  color: '#B0B0B0',
                },
              },
            }}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
