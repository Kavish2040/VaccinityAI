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
  Grow,
  Zoom,
  CardMedia,
  Paper,
  Divider,
  Avatar,
  Tooltip, Dialog, DialogContent, 
} from '@mui/material';
import { motion, AnimatePresence  } from 'framer-motion';
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
import { AccountCircle, Notifications, PlayArrow, Close,
  Lightbulb, Storage, Security, Speed, EventNote, LocalHospital } from '@mui/icons-material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FloatingChatbot from './chatbot/FloatingChatbot';  
import { Email, Person, Message } from '@mui/icons-material';
import ContactForm from './contactform/page.js';
import EnhancedDivider from './EnhancedDivider/page.js';
import FeaturesSection from './FeaturesSection/page.js'; 
import EnhancedCTASection from './EnhancedCTASection/page.js'; 

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

const AnimatedIcon = ({ icon, isActive }) => (
  <motion.div
    initial={{ scale: 1 }}
    animate={{ scale: isActive ? 1.2 : 1, rotate: isActive ? 360 : 0 }}
    transition={{ duration: 0.5 }}
  >
    {React.cloneElement(icon, { sx: { fontSize: 60, color: isActive ? 'primary.main' : 'text.secondary' } })}
  </motion.div>
);

const TimelineStep = ({ icon, title, description, isActive, onClick }) => (
  <Card 
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isActive ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      },
    }}
  >
    <CardContent>
      <AnimatedIcon icon={icon} isActive={isActive} />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: isActive ? 'primary.main' : 'text.primary' }}>
        {title}
      </Typography>
      <Grow in={isActive} timeout={500}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: '250px' }}>
          {description}
        </Typography>
      </Grow>
    </CardContent>
  </Card>
);

const ServiceExplanation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openVideo, setOpenVideo] = useState(false);

  const steps = [
    { 
      icon: <AccountCircle />, 
      title: "Sign Up",
      description: "Create your profile and input your health information securely.",
    },
    { 
      icon: <Psychology />, 
      title: "AI Matching",
      description: "Our AI analyzes your profile to find suitable clinical trials.",
    },
    { 
      icon: <Notifications />, 
      title: "Stay Informed",
      description: "Receive updates, educational resources, and support throughout your journey.",
    },
  ];

  const features = [
    { icon: <Lightbulb />, title: "Smart Recommendations", description: "AI-powered trial suggestions" },
    { icon: <Storage />, title: "Data Integration", description: "Seamless health record sync" },
    { icon: <Security />, title: "Privacy First", description: "Advanced data protection" },
    { icon: <Speed />, title: "Real-time Matching", description: "Instant trial compatibility" },
    { icon: <EventNote />, title: "Scheduling Assistant", description: "Automated appointment setting" },
    { icon: <LocalHospital />, title: "Medical Support", description: "24/7 expert assistance" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography variant="h2" gutterBottom textAlign="center" fontWeight="bold" mb={6}>
          How VaccinityAI Works
        </Typography>
        
        <Box sx={{ position: 'relative', my: 8, mb: 3 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '4px',
              bgcolor: 'grey.300',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              height: '4px',
              backgroundColor: '#8C52FF',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                  <div>
                    <TimelineStep
                      {...step}
                      isActive={index === activeStep}
                      onClick={() => setActiveStep(index)}
                    />
                  </div>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(140, 82, 255, 0.3)',
              },
            }}
          >
            Next Step
          </Button>
        </Box>
       
        {/* Video and Features */}
        <Grid container spacing={4} alignItems="center" sx={{ mt: 8 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // Square aspect ratio
                borderRadius: '50%', // Circular shape
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(5deg)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                },
              }}
              onClick={() => setOpenVideo(true)}
            >
              <img
                src="/mainp.png"
                alt="VaccinityAI in action"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              >
                <PlayArrow sx={{ fontSize: 80, color: 'white' }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
            Driving Innovation in Healthcare
            </Typography>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <Tooltip title={feature.description} arrow TransitionComponent={Zoom}>
                    <Card elevation={2} sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      },
                    }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {feature.icon}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {feature.title}
                      </Typography>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Video Dialog */}
      <Dialog
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, bgcolor: 'background.paper' }}>
          <IconButton
            onClick={() => setOpenVideo(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <Close />
          </IconButton>
          <Box sx={{ position: 'relative', pb: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/sVUNRKtpmnA"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

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
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit" display="block" mb={1}>Clinical Trials</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Patient Stories</Link>
            <Link href="#" color="inherit" display="block" mb={1}>FAQs</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Blog</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Link href="#" color="inherit" display="block" mb={1}>About Us</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Careers</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Partners</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Contact</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" display="block" mb={1}>Privacy Policy</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Terms of Service</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Cookie Policy</Link>
            <Link href="#" color="inherit" display="block" mb={1}>GDPR</Link>
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
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
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
        <Box mt={3}>
          <Divider />
        </Box>
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
    setTimeout(() => setRippleEffect(false), 500);
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
        <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', width: '100%' }}>
          <Toolbar sx={{ mb: -2 }}>
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
                <Button color="primary" onClick={() => router.push('/sign-up')} variant="contained" sx={{ borderRadius: 30 }}>
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
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
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
                    router.push('/generate');
                  } else {
                    setOpenModal(true);
                  }
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </Container>
        </GradientBox>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
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
              width: { xs: 300, sm: 400 },
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
                  router.push('/sign-up');
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
