import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
import ScienceIcon from '@mui/icons-material/Science';
import SpeedIcon from '@mui/icons-material/Speed';
import getStripe from '@/utils/get-stripe';

const AnimatedStatistic = ({ icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
      {icon}
      <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1, color: 'primary.main' }}>
        {value}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {label}
      </Typography>
    </Box>
  </motion.div>
);

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

const BlendedCTASection = () => {
  return (
    <Box sx={{ py: 10, mb: 7}}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                Start Your Journey with VaccinityAI
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
              Unlock your path to groundbreaking treatments and personalized care
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #8C52FF 30%, #FF5E84 90%)',
                    boxShadow: '0 3px 5px 2px rgba(140, 82, 255, .3)',
                  }}
                  onClick={handleCheckout}
                >
                  Join VaccinityAI
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      background: 'rgba(140, 82, 255, 0.1)',
                    },
                  }}
                >
                  Explore Features
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                  value="XXXX+"
                  label="Patients Matched"
                />
              </Grid>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={<ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                  value="10,000+"
                  label="Clinical Trials"
                />
              </Grid>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={<SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                  value="24/7"
                  label="AI-Powered Support"
                />
              </Grid>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={<ExploreIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
                  value="95%"
                  label="User Satisfaction"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlendedCTASection;