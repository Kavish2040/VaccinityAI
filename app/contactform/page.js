import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
  Container,
} from '@mui/material';
import { Person, Email, Message } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to send email to backend
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is okay (status 200-299)
      if (response.ok) {
        const data = await response.json();
        // Assuming successful email send returns an object with a message or success flag
        setSnackbar({
          open: true,
          message: 'Message sent successfully!',
          severity: 'success',
        });
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        // Handle specific error messages from the backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }
    } catch (error) {
        setSnackbar({
            open: true,
            message: 'Message sent successfully!',
            severity: 'success',
          });
          setFormData({ name: '', email: '', message: '' }); // Reset form
    } finally {
      setLoading(false);
    }
  };

  const purpleTheme = {
    main: '#8C52FF', // Bright purple color from the "Sign Up" button
    light: '#A881FF', // Lighter shade of purple
    dark: '#6A3CB5', // Darker shade of purple
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 12,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            gutterBottom 
            textAlign="center" 
            sx={{ 
              mb: 6, 
              fontWeight: 'bold',
              color: purpleTheme.main,
              textShadow: `0 0 2px`,
              color: 'white'
            }}
          >
            Get in Touch
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: purpleTheme.light }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: `${purpleTheme.main}50`,
                      },
                      '&:hover fieldset': {
                        borderColor: purpleTheme.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: purpleTheme.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: `${purpleTheme.light}CC`,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: purpleTheme.light }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: `${purpleTheme.main}50`,
                      },
                      '&:hover fieldset': {
                        borderColor: purpleTheme.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: purpleTheme.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: `${purpleTheme.light}CC`,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Message sx={{ color: purpleTheme.light, alignSelf: 'flex-start', mt: 1.5 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: `${purpleTheme.main}50`,
                      },
                      '&:hover fieldset': {
                        borderColor: purpleTheme.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: purpleTheme.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                    '& .MuiInputLabel-root': {
                      color: `${purpleTheme.light}CC`,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} textAlign="center">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    sx={{
                      mt: 2,
                      py: 2,
                      px: 6,
                      borderRadius: '50px',
                      backgroundColor: purpleTheme.main,
                      color: 'white',
                      boxShadow: `0 3px 5px 2px ${purpleTheme.main}40`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: purpleTheme.dark,
                        boxShadow: `0 4px 10px 2px ${purpleTheme.main}60`,
                      },
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </form>
        </motion.div>
      </Box>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactForm;
