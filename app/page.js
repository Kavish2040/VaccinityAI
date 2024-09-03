'use client';
import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import {
  Container, Typography, AppBar, Toolbar, Button, Box, Grid, Paper, ThemeProvider, createTheme, CssBaseline, Card, CardContent, Stack, Switch
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Typewriter from './Typewriter'; // Import the Typewriter component
import { LocalHospital as StethoscopeIcon } from '@mui/icons-material';
import { Devices as DevicesIcon, Psychology as PsychologyIcon, MenuBook as MenuBookIcon, Dashboard as DashboardIcon, Assistant as AssistantIcon, Update as UpdateIcon } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';


// Import all necessary icons
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import TextFieldsIcon from '@mui/icons-material/TextFields';




export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#21CBF3',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 500,
      },
      poster: {
        fontSize: '2rem',
        color: 'red',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  const handleCheckout = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST'
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.status === 500) {
      console.error("Error during checkout:", checkoutSessionJson.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    });

    if (error) {
      console.warn("Stripe checkout error:", error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Head>
          <title>Vaccinity AI - Empowering Patient Care</title>
          <meta name="description" content="Vaccinity AI leverages advanced AI technology to match patients with suitable clinical trials and simplifies complex medical information." />
        </Head>


        <AppBar
            position="sticky"
            style={{
                background: 'black',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
                borderRadius: '1px',
            }}
            elevation={2}
        >
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' , mb:-1}}>
                    <Image src="/logo1.png" alt="Vaccinity AI Logo" width={190} height={100}  />
                </Box>
                
                <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', mr: 3 }}>
                <Button color="inherit" onClick={() => router.push('/')}>
                    HOME
                </Button>
                <Typography sx={{ mx: 2 }}>|</Typography> {/* Separator */}
                <Button color="inherit" onClick={() => router.push('/dashboard')}>
                    DASHBOARD
                </Button>
                <Typography sx={{ mx: 2 }}>|</Typography> {/* Separator */}

                <SignedOut>
                    <Button color="inherit" onClick={() => router.push('/sign-up')}>
                        SIGN UP
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Box>

                <LightModeOutlinedIcon style={{ color: '#FFFFFF', marginRight: '1px' }} />
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        color="default"
                        inputProps={{ 'aria-label': 'toggle dark mode' }}
                    />
                    <DarkModeOutlinedIcon style={{ color: '#FFFFFF', marginLeft: '1px' }} />
            </Toolbar>
        </AppBar>




<Box sx={{
  textAlign: "center",
  py: 12,
  background: 'linear-gradient(45deg, #4D1979 30%, #FF0066 90%)', // Deep purple to magenta gradient
  color: 'white',
  borderRadius: { xs: 0, sm: 2 },
  mx: { xs: 0, sm: 2 },
  my: 4,
  boxShadow: '0 3px 5px 2px rgba(77, 25, 121, 0.3)', // Adjusted shadow to match the new gradient colors
}}>
  <SignedIn>
    <Typography variant="h2" gutterBottom>
    {user ? `Hey ${user.firstName || 'there'},  ` : ' '}
      Welcome to <span style={{
        background: 'linear-gradient(90deg, #EE9CA7 , #FFDDE1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'cursive, sans-serif',
        fontWeight: 'bold'
      }}>
        <Typewriter text="VaccinityAI"/>
      </span>
    </Typography>
    <Typography variant="h5" gutterBottom sx={{ maxWidth: '650px', mx: 'auto', mb: 4 }}>
      Empowering patients to take control of their health journey.
    </Typography>
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
      <Button
        variant="contained"
        size="large"
        sx={{
          py: 1.5,
          px: 4,
          fontSize: '1.1rem',
          backgroundColor: 'white',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }
        }}
        onClick={() => router.push('/dashboard')}
      >
        Get Started
      </Button>
    </Stack>
  </SignedIn>
  <SignedOut>
    <Typography variant="h2" gutterBottom>
      Welcome to <span style={{
        background: 'linear-gradient(90deg, #EE9CA7, #FFDDE1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'cursive, sans-serif',
        fontWeight: 'bold'
      }}>
        <Typewriter text="VaccinityAI"/>
      </span>
    </Typography>
    <Typography variant="h5" gutterBottom sx={{ maxWidth: '650px', mx: 'auto', mb: 4 }}>
      Empowering patients to take control of their health journey.
    </Typography>
    <Button
      variant="contained"
      size="large"
      sx={{
        py: 1.5,
        px: 4,
        fontSize: '1.1rem',
        backgroundColor: 'white',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }
      }}
      onClick={() => router.push('/sign-in')}
    >
      Get Started
    </Button>
  </SignedOut>
</Box>


        <Container maxWidth="lg">
          <Box sx={{ my: 8 }}>
            <Typography variant="h3" gutterBottom textAlign="center" color="primary" mb={5}>
              Features
            </Typography>
            
            <Grid container spacing={8}>
              {[
                 { icon: <DevicesIcon />, title: "AI-Powered Clinical Trial Matching", description: "Personalized matching and real-time updates on new clinical trials." },
                 { icon: <PsychologyIcon />, title: "Simplified Medical Information", description: "Use NLP to rewrite complex medical information into easy-to-understand language tailored to each patient’s literacy level." },
                 { icon: <MenuBookIcon />, title: "Educational Resources", description: "Develop educational content, including articles, videos, and infographics, to help patients understand their diagnosis, treatment options, and the clinical trial process." },
                 { icon: <DashboardIcon />, title: "Health Data Dashboard", description: "A personalized dashboard to track health data, clinical trial participation, and educational resources." },
                 { icon: <AssistantIcon />, title: "Virtual Health Assistant", description: "A virtual assistant to answer patient queries, provide reminders for medication and appointments, and offer support throughout their health journey." },
                 { icon: <UpdateIcon />, title: "Real-Time Updates", description: "Provide updates on new clinical trials as they become available, ensuring patients have access to the latest opportunities." },
             ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card elevation={5} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ fontSize: 50, color: 'primary.main', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 12, textAlign: "center" }}>
            <Typography variant="h3" gutterBottom color="primary" mb={6}>Pricing</Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Subscription Plan
                    </Typography>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ my: 3 }}>
                      $5 <Typography component="span" variant="subtitle1">/ month</Typography>
                    </Typography>
                    <Typography sx={{ mb: 1, minHeight: '60px' }}>
                      Access personalized clinical trial matches and additional resources.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={handleCheckout}
                      sx={{ py: 1 }}
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
