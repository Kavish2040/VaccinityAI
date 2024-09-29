// app/sign-in/page.js
"use client";
import React from 'react';
import Image from "next/image";
import { SignIn } from '@clerk/nextjs';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Link,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
  Fade
} from '@mui/material';
import { useRouter } from 'next/navigation';

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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

export default function SignInPage() {
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', height: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo1.png" alt="VaccinityAI Logo" width={150} height={80} />
          </Box>
          <Box>
            <Button color="inherit" onClick={() => router.push('/')} sx={{ mr: 2 }}>
              Home
            </Button>
            <Button color="inherit" onClick={() => router.push('/sign-up')}>
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}>
        <Fade in={true} timeout={1000}>
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
            <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
              Welcome Back
            </Typography>
            <Box sx={{ display: 'flex', width: '100%', mb: 4, mr: 2 }}>
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                // Redirect to /redirect-dashboard after sign-in
                afterSignInUrl="/redirect-dashboard"
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
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, textAlign: 'center' }}>
              Don't have an account? <Link href="/sign-up" sx={{ color: 'primary.main', fontWeight: 'medium' }}>Sign up</Link>
            </Typography>
          </Paper>
        </Fade>
      </Container>
    </ThemeProvider>
  );
}
