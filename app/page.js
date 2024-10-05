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
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence, useViewportScroll, useTransform} from 'framer-motion';
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
import { grey, blue } from '@mui/material/colors';
// Custom Components
import FloatingChatbot from './chatbot/FloatingChatbot';
import ContactForm from './contactform/page.js';
import FeaturesSection from './FeaturesSection/page.js';
import EnhancedCTASection from './EnhancedCTASection/page.js';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ScienceIcon from '@mui/icons-material/Science';
import InsightsIcon from '@mui/icons-material/Insights';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  Timeline,
  TimelineItem as MuiTimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';

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
      }}
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/covid-trials.jpg)', // Update with the actual image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(30%)', // Darkens the image for better text readability
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Content Container */}
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, padding: { xs: '0 20px', sm: '0 40px' } }}
      >
        <Box sx={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          {/* Animated Heading */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 500,
                color: '#FFFFFF',
                marginBottom: 2,
                fontSize: {
                  xs: '1.8rem',
                  sm: '2.5rem',
                  md: '3.2rem',
                  lg: '4rem',
                },
                lineHeight: 1.2,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: '-0.02em',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              Bridging Patients and Research
            </Typography>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#FFFFFF', // Enhanced readability with white text
                marginBottom: 4,
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.2rem',
                },
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Are you a{' '}
              <Box
                component="span"
                sx={{ color: '#4CAF50', fontWeight: 'bold' }}
              >
                Patient
              </Box>
              ? Enter your condition below to begin
            </Typography>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
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
                  style: {
                    color: '#FFFFFF',
                    paddingLeft: '20px',
                    fontFamily: "'Roboto', sans-serif",
                  },
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
                  backgroundColor: '#4285F4',
                  '&:hover': { backgroundColor: '#3367D6' },
                  padding: '10px',
                  borderRadius: '50%',
                  marginRight: '6px',
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
            transition={{ delay: 0.6, duration: 1 }}
          >
            <Button
              variant="outlined"
              size="large"
              sx={{
                marginTop: 4,
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                borderRadius: '30px',
                padding: '10px 30px',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#FF8C00',
                  borderColor: '#000000',
                },
              }}
              onClick={() => {
                const featuresSection = document.getElementById('features-section');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </Box>
      </Container>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
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
        backdropFilter: 'blur(2px)',
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
          <Image src="/logo1.png" alt="VaccinityAI Logo" width={195} height={105} />
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
              '&:hover': { color: 'orange' },
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
              '&:hover': { color: 'orange' },
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

const StepItem = ({ icon, title, description, isFirst, isLast }) => {
  return (
    <Box sx={{ position: 'relative', flex: 1, textAlign: 'center' }}>
      {/* Left Connector Line */}
      {!isFirst && (
        <motion.div
          variants={lineVariants}
          style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            width: '50%',
            height: '2px',
            backgroundColor: '#3f51b5',
            transformOrigin: 'left',
            zIndex: 0,
          }}
        />
      )}

      {/* Animated Icon */}
      <motion.div
        variants={stepVariants}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Avatar
          sx={{
            bgcolor: '#3A7BD5',
            width: 80,
            height: 80,
            margin: '0 auto',
            mb: 2,
          }}
        >
          {icon}
        </Avatar>
      </motion.div>

      {/* Right Connector Line */}
      {!isLast && (
        <motion.div
          variants={lineVariants}
          style={{
            position: 'absolute',
            top: '40px',
            right: 0,
            width: '50%',
            height: '2px',
            backgroundColor: '#3A7BD5',
            transformOrigin: 'left',
            zIndex: 0,
          }}
        />
      )}

      {/* Animated Title and Description */}
      <motion.div variants={stepVariants}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </motion.div>
    </Box>
  );
};

const ServiceExplanation = () => {
  const [openVideo, setOpenVideo] = useState(false);

  const steps = [
    {
      icon: <AccountBoxIcon sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Sign Up',
      description:
        'Create your profile and securely input your health information to get started.',
    },
    {
      icon: <ScienceIcon sx={{ fontSize: 40, color: 'white' }} />,
      title: 'AI Matching',
      description:
        'Our AI analyzes your profile to match you with suitable clinical trials.',
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Stay Informed',
      description:
        'Receive updates, educational resources, and support throughout your journey.',
    },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        {/* Section Title */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 8 }}
        >
          How VaccinityAI Works
        </Typography>

        {/* Horizontal Timeline */}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          sx={{ position: 'relative', mb: 8, overflow: 'hidden' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {steps.map((step, index) => (
              <StepItem
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isFirst={index === 0}
                isLast={index === steps.length - 1}
              />
            ))}
          </Box>
        </Box>

        {/* Video Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => setOpenVideo(true)}
            style={{ cursor: 'pointer' }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <video
                src="/video1dna.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Play Icon Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.6)',
                    width: 80,
                    height: 80,
                  }}
                >
                  <PlayArrowIcon sx={{ color: '#fff', fontSize: 50 }} />
                </Avatar>
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Video Modal */}
        <Modal
          open={openVideo}
          onClose={() => setOpenVideo(false)}
          closeAfterTransition
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openVideo}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '80%', md: '60%' },
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 2,
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={() => setOpenVideo(false)}
                aria-label="Close Video"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'grey.500',
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Embedded YouTube Video */}
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://www.youtube.com/embed/sVUNRKtpmnA"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="VaccinityAI Overview"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                  }}
                ></iframe>
              </Box>
            </Box>
          </Fade>
        </Modal>
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
