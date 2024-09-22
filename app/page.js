'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
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
  Backdrop,
  TextField,
  Link,
  IconButton,
  Paper,
  Divider  // Added Divider here
} from '@mui/material';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { Devices, Psychology, MenuBook, Dashboard, Assistant, Update } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { AccountCircle, Notifications } from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FloatingChatbot from './chatbot/FloatingChatbot';  // Adjust the import path as needed
import { Email, Person, Message } from '@mui/icons-material';
import ContactForm from './contactform/page.js';
import EnhancedDivider from './EnhancedDivider/page.js';
import FeaturesSection from './FeaturesSection/page.js'; // Adjust the import path as needed
import EnhancedCTASection from './EnhancedCTASection/page.js'; // Import the new CTA section

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

const TimelineStep = ({ icon, title, description, isActive, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <Box
      sx={{
        color: isActive ? 'primary.main' : 'text.secondary',
        transition: 'color 0.3s ease',
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 60 } })}
    </Box>
    <Typography
      variant="h6"
      color={isActive ? 'primary.main' : 'text.primary'}
      sx={{ mt: 2, fontWeight: 'bold' }}
    >
      {title}
    </Typography>
    {isActive && (
      <Box sx={{ mt: 2, maxWidth: '250px' }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    )}
  </Box>
);

const ServiceExplanation = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: <AccountCircle />, title: "Sign Up", description: "Create your profile and input your health information securely." },
    { icon: <Psychology />, title: "AI Matching", description: "Our AI analyzes your profile to find suitable clinical trials." },
    { icon: <Notifications />, title: "Stay Informed", description: "Receive updates, educational resources, and support throughout your journey." },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom textAlign="center" fontWeight="bold" mb={6}>
          How VaccinityAI Works
        </Typography>
        <Box sx={{ position: 'relative', my: 8, mb:3 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '4px',
              bgcolor: 'grey.300',
              top: '30px',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              height: '4px',
              bgcolor: 'primary.main',
              top: '30px',
              width: `${((activeStep + 1) / steps.length) * 100}%`,
              transition: 'width 0.5s ease',
            }}
          />
          <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1}}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index} mt={3}>
                <TimelineStep
                  {...step}
                  isActive={index === activeStep}
                  onClick={() => setActiveStep(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
          >
            Next Step
          </Button>
        </Box>
      </Container>
    </Box>
  );
};



<ContactForm />


const Footer = ({ darkMode }) => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: darkMode ? 'background.paper' : 'grey.100',
        color: darkMode ? 'text.primary' : 'text.secondary',
        py: 6,
        borderTop: '1px solid',
        borderColor: darkMode ? 'grey.800' : 'grey.300',
      }}
    >
      <Container maxWidth="lg" sx={{mb:-4,}}>
        <Grid container spacing={4} sx={{mt:-5}}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit">Clinical Trials</Link><br />
            <Link href="#" color="inherit">Patient Stories</Link><br />
            <Link href="#" color="inherit">FAQs</Link><br />
            <Link href="#" color="inherit">Blog</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Link href="#" color="inherit">About Us</Link><br />
            <Link href="#" color="inherit">Careers</Link><br />
            <Link href="#" color="inherit">Partners</Link><br />
            <Link href="#" color="inherit">Contact</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit">Privacy Policy</Link><br />
            <Link href="#" color="inherit">Terms of Service</Link><br />
            <Link href="#" color="inherit">Cookie Policy</Link><br />
            <Link href="#" color="inherit">GDPR</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Stay Connected
            </Typography>
            <form onSubmit={handleSubscribe}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" sx={{mt:2}}>
                Subscribe
              </Button>
            </form>
            <Box sx={{ mt: 1 }}>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3} mb={0}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} VaccinityAI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  

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
    background: 'linear-gradient(135deg, #EBF5FF 0%, #4A90E2 100%)',
    padding: theme.spacing(12, 0),
    borderRadius: '0 0 50% 50% / 4%',
    textAlign: 'center',
    color: 'white',
  }));

  const handleCheckout = async () => {
    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 500); // Reset the ripple effect after 500ms
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

        {/* AppBar Section */}
        <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)'}}>
          <Toolbar sx={{mb:-2}}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Image src="/logo1.png" alt="VaccinityAI Logo" width={205} height={110} />
            </Box>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                '& button': {
                  fontSize: '1rem',
                  fontWeight: '600',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                },
                '& .MuiSwitch-root': {
                  '& .MuiSwitch-thumb': {
                    width: 28,
                    height: 28,
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: 20,
                    opacity: 1,
                    backgroundColor: darkMode ? '#424242' : '#e0e0e0',
                  },
                },
                '& .MuiSwitch-root:hover': {
                  transform: 'scale(1.05)',
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
                icon={<LightModeOutlinedIcon sx={{ color: darkMode ? '#000000' : '#000000' }} />}
                checkedIcon={<DarkModeOutlinedIcon sx={{ color: darkMode ? '#fff' : '#fff' }} />}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                      color: '#FFFFFF',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#424242',
                      },
                    },
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: 22 / 2,
                    backgroundColor: '#B0BEC5',
                    opacity: 1,
                    transition: 'background-color 0.3s',
                  },
                  '& .MuiSwitch-thumb': {
                    width: 24,
                    height: 24,
                    backgroundColor: darkMode ? '#9C27B0' : '#FFD700',
                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              />
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
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
                    setOpenModal(true);  // Open modal if not signed in
                  }
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </Container>
        </GradientBox>



        {/* Main Content */}
        <Container maxWidth="lg">
          {/* Features Section */}
          <FeaturesSection />
      
          {/* Divider */}
          <EnhancedDivider />

          {/* Service Explanation Section */}
          <ServiceExplanation />

          {/* Divider */}
          <EnhancedDivider />
           
          <EnhancedCTASection />

 

          <EnhancedDivider />

                   {/* Contact Form Section */}
                   <ContactForm />

          {/* Call to Action Section with Parallax Effect */}
          
      
        </Container>

        {/* Modal for Sign-In Prompt */}
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

        {/* Footer Section */}
        <Footer darkMode={darkMode} />
        <FloatingChatbot />
      </Container>
    </ThemeProvider>
  );
}
