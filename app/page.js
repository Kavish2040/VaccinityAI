"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
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
  Stack,
  Modal,
  Fade,
  Backdrop,
  TextField,
  Link,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { ArrowForward, MenuBook, Science, Insights } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip, Zoom, Dialog, DialogContent } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { PersonAdd, MedicalServices, CheckCircle } from '@mui/icons-material';
// Custom Components
import FloatingChatbot from './chatbot/FloatingChatbot';
import ContactForm from './contactform/page.js';
import FeaturesSection from './FeaturesSection/page.js';
import EnhancedCTASection from './EnhancedCTASection/page.js';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#3A7BD5' },
    secondary: { main: '#FF5E84' },
    background: { default: '#F4F6F8', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '4.5rem' },
    h2: { fontWeight: 700, fontSize: '3.5rem' },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
          },
        },
      },
    },
  },
});

const HeroSection = () => {
  const [condition, setCondition] = useState('');
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'AI-Driven Solutions for a Healthier Tomorrow.';

  const handleSearch = () => {
    if (condition.trim()) {
      if (user) {
        // User is logged in, redirect to dashboard
        router.push(`/dashboard?condition=${encodeURIComponent(condition)}`);
      } else {
        // User is not logged in, redirect to sign-up page
        router.push(`/sign-up?condition=${encodeURIComponent(condition)}`);
      }
    }
  };

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 60;

    const typeWriter = () => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex));
        currentIndex++;
        setTimeout(typeWriter, typingSpeed);
      }
    };

    typeWriter();
  }, [fullText]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#000', // Fallback color
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          opacity: 0.8,
        }}
      />
      {/* Overlay for gradient effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)',
          zIndex: -1,
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: 4,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              lineHeight: 1.2,
            }}
          >
            {displayedText}
          </Typography>
        </motion.div>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1}}
        >
              <Typography
            variant="h5"
            sx={{
              color: '#5a5a5a', // Darker text for better readability
              marginBottom: 6,
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            Are you a{' '}
            <Box component="span" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Patient
            </Box>
            ? Enter your condition below to begin
          </Typography>

        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: '600px',
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50px',
              padding: '6px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Enter disease or condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              InputProps={{
                disableUnderline: true,
                style: { color: '#FFFFFF', paddingLeft: '20px' },
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              }}
            />
            <IconButton
              onClick={handleSearch}
              sx={{
                color: '#FFFFFF',
                backgroundColor: '#3a7bd5',
                '&:hover': { backgroundColor: '#2c5aa0' },
                padding: '10px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
        </motion.div>

        {/* Call-to-Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              marginTop: 4,
              color: '#FFFFFF',
              borderColor: '#FFFFFF',
              borderRadius: '30px',
              padding: '10px 30px',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: '#FFFFFF',
              },
            }}
            onClick={() => {
              document
                .getElementById('features-section')
                .scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Button>
        </motion.div>
      </Container>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
      >
        <ArrowDownwardIcon sx={{ color: '#FFFFFF', fontSize: '2rem' }} />
      </motion.div>
    </Box>
  );
};

const CustomAppBar = () => {
  const [scrolling, setScrolling] = useState(false);
  const router = useRouter();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    setScrolling(scrollTop > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={scrolling ? 4 : 0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: scrolling ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb:-1.5}}
          onClick={() => router.push('/')}
        >
          <Image src="/logo1.png" alt="VaccinityAI Logo" width={190} height={105} />
        </Box>

        {/* Navigation */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            color="inherit"
            onClick={() => router.push('/')}
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              color: scrolling ? '#000000' : '#FFFFFF',
              '&:hover': { color: '#000000' },
              transition: 'color 0.3s ease',
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push('/dashboard')}
            sx={{
              fontWeight: 500,
              fontSize: '1rem',
              color: scrolling ? '#000000' : '#FFFFFF',
              '&:hover': { color: '#000000' },
              transition: 'color 0.3s ease',
            }}
          >
            Dashboard
          </Button>

          {/* Auth Buttons */}
          <SignedOut>
            <Button
              color="primary"
              variant="contained"
              onClick={() => router.push('/sign-up')}
              sx={{
                borderRadius: 30,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                fontWeight: 'bold',
                padding: '8px 24px',
                backgroundColor: '#ff8c00',
                '&:hover': {
                  backgroundColor: '#ff8c00',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
                  color:"#000000"
                },
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              Sign Up
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

// Improved Timeline Step Design
const TimelineStep = ({ icon, title, description }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 3,
      boxShadow: '0px 10px 30px rgba(58, 123, 213, 0.2)',
      padding: 3,
      backgroundColor: 'white',
      height: '300px',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
    }}
  >
    <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
      {icon}
    </Avatar>
    <Typography variant="h6" fontWeight="600" sx={{ mb: 1, color: 'primary.main' }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '240px' }}>
      {description}
    </Typography>
  </Card>
);

// Redesigned "How VaccinityAI Works" Section with Animations
const ServiceExplanation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openVideo, setOpenVideo] = useState(false);

  const steps = [
    {
      icon: <AccountBoxIcon fontSize="large" />,
      title: 'Sign Up',
      description:
        'Create your profile and input your health information securely.',
    },
    {
      icon: <Science fontSize="large" />,
      title: 'AI Matching',
      description:
        'Our AI analyzes your profile to find suitable clinical trials.',
    },
    {
      icon: <Insights fontSize="large" />,
      title: 'Stay Informed',
      description:
        'Receive updates, educational resources, and support throughout your journey.',
    },
  ];

  const features = [
    {
      icon: <MenuBook />,
      title: 'Personalized Insights',
      description: 'Receive information tailored to your health profile.',
    },
    {
      icon: <Science />,
      title: 'Trial Matching',
      description: 'Find trials that suit your specific condition.',
    },
    {
      icon: <Insights />,
      title: '24/7 Support',
      description: 'Access resources and assistance whenever you need.',
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % steps.length);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + steps.length) % steps.length
    );
  };

  return (
    <Box sx={{ py: 10 }}>
      <Container
        maxWidth={false} // Remove maxWidth to allow full-width
        sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }} // Control padding
      >
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 8, color: '#3A7BD5' }}
        >
          How VaccinityAI Works
        </Typography>

        {/* Grid Layout with Animation on Left and Larger Circular Video with Features on Right */}
        <Grid container spacing={6} alignItems="center">
          {/* Left Side: Animation */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', minHeight: '450px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: 'absolute', width: '100%' }}
                >
                  <TimelineStep
                    icon={steps[activeStep].icon}
                    title={steps[activeStep].title}
                    description={steps[activeStep].description}
                  />
                </motion.div>
              </AnimatePresence>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -15 }}>
              <Button onClick={handleBack} sx={{ mr: 2 }}>
                Previous
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </Box>
          </Grid>

          {/* Right Side: Larger Circular GIF with Features on the Right */}
          <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 0 } }}>
            <Grid container spacing={2} alignItems="center">
              {/* Circular GIF */}
              <Grid item xs={12} sm={7}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%', // Makes it square
                    borderRadius: '50%', // Makes it circular
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05) rotate(5deg)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                    },
                  }}
                  onClick={() => setOpenVideo(true)}
                >
                  {/* Embedded GIF */}
                  <iframe
                    src="https://giphy.com/embed/kfcNKxfVXS3zkRdu29"
                    width="100%"
                    height="100%"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      borderRadius: '50%', // Keep circular shape
                    }}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
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
                     
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 80, color: 'grey' }} />
                  </Box>
                </Box>
              </Grid>

              {/* Features on the Right of the GIF */}
              <Grid item xs={12} sm={5}>
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} key={index}>
                      <Tooltip
                        title={feature.description}
                        arrow
                        TransitionComponent={Zoom}
                      >
                        <Card
                          elevation={2}
                          sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
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
          </Grid>
        </Grid>

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
                zIndex: 1,
              }}
            >
              <CloseIcon />
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
      </Container>
    </Box>
  );
};

// Footer Component
const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        color: 'text.secondary',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Resources</Typography>
            <Link href="#" color="inherit" display="block" mb={1}>Clinical Trials</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Patient Stories</Link>
            <Link href="#" color="inherit" display="block" mb={1}>FAQs</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Blog</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Company</Typography>
            <Link href="#" color="inherit" display="block" mb={1}>About Us</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Careers</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Partners</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Contact</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Legal</Typography>
            <Link href="#" color="inherit" display="block" mb={1}>Privacy Policy</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Terms of Service</Link>
            <Link href="#" color="inherit" display="block" mb={1}>Cookie Policy</Link>
            <Link href="#" color="inherit" display="block" mb={1}>GDPR</Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Stay Connected</Typography>
            <form onSubmit={handleSubscribe}>
              <TextField fullWidth size="small" placeholder="Enter your email" variant="outlined" margin="normal" />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>Subscribe</Button>
            </form>
            <Box sx={{ mt: 1 }}>
              <IconButton color="primary" aria-label="LinkedIn"><LinkedInIcon /></IconButton>
              <IconButton color="primary" aria-label="Twitter"><TwitterIcon /></IconButton>
              <IconButton color="primary" aria-label="Facebook"><FacebookIcon /></IconButton>
              <IconButton color="primary" aria-label="Instagram"><InstagramIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}><Divider /></Box>
        <Box mt={3} mb={0}>
          <Typography variant="body2" align="center">© {new Date().getFullYear()} VaccinityAI. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Home Component
export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [openModal, setOpenModal] = useState(false);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Particles Animation */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          particles: {
            number: { value: 40, density: { enable: false } },
            color: { value: '#3A7BD5' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 5, random: true },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              outMode: 'out',
              attract: { enable: true, rotateX: 600, rotateY: 1200 },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              onClick: { enable: true, mode: 'push' },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 2 },
            },
          },
          retina_detect: true,
        }}
      />

      <Head>
        <title>VaccinityAI - Empowering Patient Care</title>
        <meta
          name="description"
          content="VaccinityAI leverages advanced AI technology to match patients with suitable clinical trials and simplifies complex medical information."
        />
      </Head>

      {/* AppBar Section */}
      <CustomAppBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FeaturesSection />
        </motion.div>

        {/* Divider */}
        <Divider sx={{ my: 5 }} />

        {/* Service Explanation Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ServiceExplanation />
        </motion.div>

        {/* Divider */}
        <Divider sx={{ my: 5 }} />

        {/* Call To Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <EnhancedCTASection />
        </motion.div>

        {/* Divider */}
        <Divider sx={{ my: 5 }} />

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <ContactForm />
        </motion.div>
      </Container>

      {/* Modal for Sign-In Prompt */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 300, sm: 400 },
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
            }}
          >
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
      <Footer />

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </ThemeProvider>
  );
}
