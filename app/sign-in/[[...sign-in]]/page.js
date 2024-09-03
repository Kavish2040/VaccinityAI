"use client";
import Image from "next/image";
import { AppBar, Container, Toolbar, Typography, Button, Link, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SignIn } from '@clerk/nextjs'; // Assuming this component handles the authentication flow

const theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode throughout the application
    primary: {
      main: '#00c853', // Green color for buttons and highlights
    },
    background: {
      default: '#121212', // Dark background for the entire application
      paper: '#1d1d1d', // Slightly lighter dark shade for paper elements
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disables uppercase text for buttons
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Ensures all links are white
          textDecoration: 'none', // Removes underline from links
          '&:hover': {
            textDecoration: 'underline', // Adds underline on hover for better UX
          },
        },
      },
    },
  },
});

export default function SignInPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "#000000", p: 1 }}>
        <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' , mb:-2}}>
                    <Image src="/logo1.png" alt="Vaccinity AI Logo" width={190} height={100}  />
                </Box>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Login
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
          backgroundColor: theme.palette.background.default,
          borderRadius: 2,
          boxShadow: 1,
          p: 3,
        }}>

          <SignIn />
          <Typography variant="body2" sx={{ color: 'gray', mt: 2 }}>
            Don’t have an account? <Link href="/sign-up" sx={{ color: 'primary.main' }}>Sign up</Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
