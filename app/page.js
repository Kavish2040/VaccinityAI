'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Box,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Card,
  CardContent,
  Stack,
  Switch,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { useUser } from '@clerk/nextjs';
import { styled } from '@mui/material/styles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { Devices, Psychology, MenuBook, Dashboard, Assistant, Update } from '@mui/icons-material';

const AnimatedTypography = ({ text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
  >
    <Typography variant="h1" component="h2" gutterBottom>
      {text}
    </Typography>
  </motion.div>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 4, overflow: 'hidden' }}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ color: 'primary.main', mb: 2, fontSize: 48 }}>
          {icon}
        </Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#8C52FF',
      },
      secondary: {
        main: '#FF5E84',
      },
      background: {
        default: darkMode ? '#121212' : '#F4F6F8',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '4rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '3rem',
      },
      h5: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 30,
            textTransform: 'none',
            fontWeight: 600,
            padding: '12px 24px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          },
        },
      },
    },
  });

  const GradientBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #EBF5FF 0%, #4A90E2 100%)', // Lighter blue transitioning to a darker blue
    padding: theme.spacing(12, 0),
    borderRadius: '0 0 50% 50% / 4%',
    textAlign: 'center',
    color: 'white',
  }));
  

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
          <title>VaccinityAI - Empowering Patient Care</title>
          <meta name="description" content="VaccinityAI leverages advanced AI technology to match patients with suitable clinical trials and simplifies complex medical information." />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </Head>

        <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)'}}>
          <Toolbar sx={{mb:-2}}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Image src="/logo1.png" alt="VaccinityAI Logo" width={205} height={110} />
            </Box>
            <Stack
              direction="row"
              spacing={3} // Increase spacing for better balance
              alignItems="center"
              sx={{
                '& button': {
                  fontSize: '1rem', // Adjust font size for modern typography
                  fontWeight: '600', // Bold text for stronger visual emphasis
                  padding: '8px 16px', // Adjust padding for more clickable space
                  transition: 'all 0.3s ease-in-out', // Smooth hover transitions
                  '&:hover': {
                    transform: 'translateY(-2px)', // Lift effect on hover for interactivity
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                  },
                },
                '& .MuiSwitch-root': {
                  '& .MuiSwitch-thumb': {
                    width: 28, // Enlarge the thumb for a more tactile feel
                    height: 28, // Make the switch bigger
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: 20, // Softer corners for the switch track
                    opacity: 1,
                    backgroundColor: darkMode ? '#424242' : '#e0e0e0', // Adjust based on dark mode
                  },
                },
                '& .MuiSwitch-root:hover': {
                  transform: 'scale(1.05)', // Subtle scale effect on hover
                },
              }}
            >
              <Button color="inherit" onClick={() => router.push('/')}>
                Home
              </Button>
              <Button color="inherit" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <SignedOut>
                <Button color="primary"   onClick={() => router.push('/sign-up')} variant="contained" sx={{ borderRadius: 30 } }>
                  Sign Up
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  icon={<LightModeOutlinedIcon sx={{ color: '#000000' }} />}  // Yellow sun for light mode
                  checkedIcon={<DarkModeOutlinedIcon sx={{ color: '#fff' }} />}  // Purple moon for dark mode
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: '#FFFFFF',  // Thumb color when checked (dark mode)
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#424242',  // Track color for dark mode
                        },
                      },
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 22 / 2,  // Round track
                      backgroundColor: '#B0BEC5',  // Light mode track color
                      opacity: 1,
                      transition: 'background-color 0.3s',  // Smooth transition on track color change
                    },
                    '& .MuiSwitch-thumb': {
                      width: 24,  // Larger thumb size
                      height: 24,
                      backgroundColor: darkMode ? '#9C27B0' : '#FFD700',  // Thumb color based on mode
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',  // Add shadow to thumb
                    },
                  }}
                />

            </Stack>

          </Toolbar>
        </AppBar>

        <GradientBox>
          <Container maxWidth="md">
            <AnimatedTypography text={`Hey ${user?.firstName || 'there'},`} delay={0.2} />
            <AnimatedTypography text="Welcome to VaccinityAI" delay={0.4} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
                Empowering patients to take control of their health journey
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
              variant="contained"
              size="large"
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
              onClick={() => {
                if (user) {
                  router.push('/generate');  // Redirect to the generate page if the user is signed in
                } else {
                  setOpenModal(true);  // Redirect to sign-in page if not signed in
                }
              }}
            >
              Get Started
            </Button>
            </motion.div>
          </Container>
        </GradientBox>

        <Container maxWidth="lg">
          <Box sx={{ my: 12 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
                Features
              </Typography>
            </motion.div>
            <Grid container spacing={4}>
              {[
                { icon: <Devices fontSize="large" />, title: "AI-Powered Clinical Trial Matching", description: "Personalized matching and real-time updates on new clinical trials." },
                { icon: <Psychology fontSize="large" />, title: "Simplified Medical Information", description: "We use NLP to rewrite complex medical information into easy-to-understand language." },
                { icon: <MenuBook fontSize="large" />, title: "Educational Resources", description: "Access to articles and infographics to help understand diagnoses and treatment options." },
                { icon: <Dashboard fontSize="large" />, title: "Health Data Dashboard", description: "A personalized dashboard to track health data and clinical trial participation." },
                { icon: <Assistant fontSize="large" />, title: "Virtual Health Assistant", description: "AI-powered assistant to answer queries and provide support throughout your health journey." },
                { icon: <Update fontSize="large" />, title: "Real-Time Updates", description: "Stay informed with the latest clinical trial opportunities as they become available." },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <FeatureCard {...feature} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 12, textAlign: "center" }}>
            <Typography variant="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
              Start Your Journey
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
              sx={{ py: 2, px: 6, fontSize: '1.2rem' }}
            >
              Join VaccinityAI
            </Button>
          </Box>
        </Container>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
            }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Welcome to VaccinityAI!
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Ready to take control of your health journey? Let's get started by setting up your profile.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => {
                  setOpenModal(false);
                  router.push('/sign-in');
                }}
              >
                Set Up Profile
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}