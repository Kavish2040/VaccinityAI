import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Devices,
  Psychology,
  MenuBook,
  Dashboard,
  Assistant,
  Update,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1 
      } 
    },
    hover: { 
      scale: 1.03, 
      boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            overflow: 'hidden',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.primary.main}20`,
            transition: 'all 0.3s ease',
          }}
          elevation={0}
        >
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <motion.div
              animate={{ rotate: isExpanded ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            </motion.div>
            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom color="text.primary">
              {title}
            </Typography>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {description}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ alignSelf: 'center', mb: 1, color: theme.palette.primary.main }}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Card>
      </motion.div>
    </Grid>
  );
};

const FeaturesSection = () => {
  const theme = useTheme();
  const features = [
    {
      icon: Devices,
      title: 'AI-Powered Trial Matching',
      description: 'Our advanced AI algorithms provide personalized matching and real-time updates on new clinical trials, tailored to your unique health profile.',
    },
    {
      icon: Psychology,
      title: 'Simplified Medical Info',
      description: 'We use cutting-edge NLP to transform complex medical information into easy-to-understand language, making your health journey clearer.',
    },
    {
      icon: MenuBook,
      title: 'Educational Resources',
      description: 'Access a wealth of articles, interactive infographics, and videos to help you better understand your diagnoses and explore treatment options.',
    },
    {
      icon: Dashboard,
      title: 'Health Data Dashboard',
      description: 'Visualize your health progress with our intuitive, personalized dashboard. Track your data and clinical trial participation all in one place.',
    },
    {
      icon: Assistant,
      title: 'Virtual Health Assistant',
      description: 'Meet your 24/7 AI companion, ready to answer queries, provide timely reminders, and offer unwavering support throughout your health journey.',
    },
    {
      icon: Update,
      title: 'Real-Time Updates',
      description: 'Stay ahead with instant notifications about new trial opportunities, personalized health tips, and important reminders tailored just for you.',
    },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: 'white',
                textShadow: `1px 1px 2px ${theme.palette.primary.main}20`,
              }}
            >
              Our Cutting-Edge Features
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, maxWidth: '800px', margin: 'auto', mt: 2 }}
            >
              Discover how our innovative platform can revolutionize and empower your health journey.
            </Typography>
          </Box>
        </motion.div>
        <Grid container spacing={4} alignItems="stretch">
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index} {...feature} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;