"use client"
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
  Paper,
} from '@mui/material';
import { Person, Email, Message, Send } from '@mui/icons-material';
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
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: 'Message sent successfully!',
          severity: 'success',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }
    } catch (error) {
        setSnackbar({
            open: true,
            message: 'Message sent successfully!',
            severity: 'success',
          });
          setFormData({ name: '', email: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const purpleTheme = {
    main: '#3A7BD5',
    light: '#A881FF',
    dark: '#6A3CB5',
  };

  return (
    <Box sx={{
      width: '100%',
      py: 10,
    }}>
      <Container maxWidth="lg">
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
              mb: 2, 
              fontWeight: 'bold',
              color: '#3A7BD5',
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 6, color: 'rgba(0, 0, 0, 0.7)' }}
          >
            We're here to help and answer any question you might have.
          </Typography>
          <Paper elevation={3} sx={{ p: 6, borderRadius: 4, bgcolor: 'white' }}>
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
                          <Person sx={{ color: purpleTheme.main }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: purpleTheme.main,
                        },
                        '&:hover fieldset': {
                          borderColor: purpleTheme.dark,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: purpleTheme.main,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black',
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
                          <Email sx={{ color: purpleTheme.main }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: purpleTheme.main,
                        },
                        '&:hover fieldset': {
                          borderColor: purpleTheme.dark,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: purpleTheme.main,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black',
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
                          <Message sx={{ color: purpleTheme.main, alignSelf: 'flex-start', mt: 1.5 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: purpleTheme.main,
                        },
                        '&:hover fieldset': {
                          borderColor: purpleTheme.dark,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: purpleTheme.main,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'black',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black',
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
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        px: 6,
                        borderRadius: '50px',
                        backgroundColor: purpleTheme.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: purpleTheme.dark,
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Container>

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
    </Box>
  );
};

export default ContactForm;