"use client"
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, useTheme, Container } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { 
  MonitorHeart, 
  BiotechOutlined, 
  HealthAndSafety, 
  PsychologyAlt,
  MedicalInformation,
  AccountTreeOutlined
} from '@mui/icons-material';

const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: '#fff',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
}));

const features = [
  {
    icon: <MonitorHeart fontSize="large" />,
    title: "AI-Powered Clinical Trial Matching",
    description: "Advanced AI algorithms analyze patient data to match you with the most relevant clinical trials, accelerating access to innovative treatments and improving health outcomes.",
  },
  {
    icon: <BiotechOutlined fontSize="large" />,
    title: "Personalized Health Insights",
    description: "Simplify complex medical information with AI-driven natural language processing, providing easy-to-understand, personalized insights into your health.",
  },
  {
    icon: <HealthAndSafety fontSize="large" />,
    title: "Secure Health Data Management",
    description: "Your data is protected with state-of-the-art encryption and compliance with HIPAA and GDPR, ensuring privacy and security at every step.",
  },
  {
    icon: <PsychologyAlt fontSize="large" />,
    title: "Virtual Health Assistant",
    description: "Receive reminders, answer queries, and get personalized support through our AI-powered virtual health assistant, designed to guide you throughout your health journey.",
  },
  {
    icon: <MedicalInformation fontSize="large" />,
    title: "Educational Content Hub",
    description: "Access articles, videos, and infographics to understand your medical condition, treatment options, and the clinical trial process—all presented in an easy-to-understand format.",
  },
  {
    icon: <AccountTreeOutlined fontSize="large" />,
    title: "Comprehensive Health Dashboard",
    description: "Track your health metrics, clinical trial participation, and educational resources in one intuitive dashboard, empowering you to manage your health journey effectively.",
  }
];


const FeaturesSection = () => {
  const theme = useTheme();

  return (
    <Box id="features-section">
    <Box sx={{ py: 12, }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom color="#3A7BD5">
            Revolutionizing Healthcare
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Discover how our innovative solutions are shaping the future of clinical trial matching.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <FeatureCard elevation={6}>
                  <CardContent sx={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FeatureIconWrapper>
                      {feature.icon}
                    </FeatureIconWrapper>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    </Box>
  );
};

export default FeaturesSection;
