"use client"
import React from 'react';
import { Box, Typography, Button, Grid, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
import ScienceIcon from '@mui/icons-material/Science';
import SpeedIcon from '@mui/icons-material/Speed';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import getStripe from '@/utils/get-stripe';

const FullWidthBox = styled(Box)(({ theme }) => ({
  // Removed full-width styles to make the section cover less width
  padding: theme.spacing(10, 0),
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(0, 4),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  background: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const AnimatedStatistic = ({ icon: Icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <StatCard elevation={2}>
      <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </StatCard>
  </motion.div>
);

const handleCheckout = async () => {
  try {
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
  } catch (error) {
    console.error("Unexpected error during checkout:", error);
  }
};

const ProfessionalCTASection = () => {
  const theme = useTheme();

  return (
    <FullWidthBox>
      <ContentWrapper>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
              >
                Empower Your Health Journey
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
                Join VaccinityAI to access cutting-edge clinical trials and personalized care
                solutions.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  onClick={handleCheckout}
                  sx={{
                    borderRadius: 30,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    color: 'white',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderRadius: 30,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: `${theme.palette.primary.main}3`,
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={PeopleIcon}
                  value="XX,XXX+"
                  label="Patients Matched"
                />
              </Grid>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={ScienceIcon}
                  value="10,000+"
                  label="Clinical Trials"
                />
              </Grid>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={SpeedIcon}
                  value="24/7"
                  label="AI-Powered Support"
                />
              </Grid>
              <Grid item xs={6}>
                <AnimatedStatistic
                  icon={ThumbUpIcon}
                  value="98%"
                  label="User Satisfaction"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ContentWrapper>
    </FullWidthBox>
  );
};

export default ProfessionalCTASection;
