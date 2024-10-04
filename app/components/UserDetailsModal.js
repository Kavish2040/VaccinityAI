// app/components/UserDetailsModal.js

"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Radio,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Fade,
  useTheme,
  TextField,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import { useUser } from '@clerk/nextjs';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

// Styled Components for Enhanced Aesthetics
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.5, 5),
  transition: 'all 0.3s ease',
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  },
}));

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
}));

const questions = [
  {
    label: 'What type of cancer do you have?',
    field: 'typeOfCancer',
    type: 'select',
    options: [
      'Breast Cancer',
      'Lung Cancer',
      'Prostate Cancer',
      'Colon Cancer',
      'Skin Cancer',
      'Other',
    ],
  },
  {
    label: 'What stage is your cancer in?',
    field: 'stage',
    type: 'select',
    options: ['Stage I', 'Stage II', 'Stage III', 'Stage IV'],
  },
  {
    label: 'Have you had chemotherapy?',
    field: 'chemotherapy',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    label: 'Have you had radiation?',
    field: 'radiation',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    label: 'Have you had any other treatment?',
    field: 'otherTreatment',
    type: 'radio',
    options: ['Yes', 'No'],
  },
  {
    label: 'What is your gender?',
    field: 'gender',
    type: 'radio',
    options: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  {
    label: 'What is your ethnicity?',
    field: 'ethnicity',
    type: 'select',
    options: [
      'Asian',
      'Black or African American',
      'Hispanic or Latino',
      'Native American',
      'White',
      'Other',
      'Prefer not to say',
    ],
  },
];

const UserDetailsModal = ({ open, onClose, existingData, onSave }) => {
  const { isLoaded, user } = useUser();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    typeOfCancer: '',
    stage: '',
    chemotherapy: '',
    radiation: '',
    otherTreatment: '',
    gender: '',
    ethnicity: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate formData with existingData if available
  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  // Reset activeStep when modal opens
  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNext = () => {
    const currentQuestion = questions[activeStep];
    if (!formData[currentQuestion.field]) {
      setErrors(prev => ({ ...prev, [currentQuestion.field]: 'This field is required' }));
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Final validation
    let valid = true;
    let newErrors = {};

    questions.forEach(question => {
      if (!formData[question.field]) {
        valid = false;
        newErrors[question.field] = 'This field is required';
      }
    });

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const db = getFirestore();
      if (existingData) {
        // Update existing document
        const q = query(
          collection(db, 'UserEntryDetails'),
          where('userId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            ...formData,
            timestamp: new Date(),
          });
        } else {
          // If somehow no document exists, create one
          await addDoc(collection(db, 'UserEntryDetails'), {
            userId: user.id,
            ...formData,
            timestamp: new Date(),
          });
        }
      } else {
        // Add new document
        await addDoc(collection(db, 'UserEntryDetails'), {
          userId: user.id,
          ...formData,
          timestamp: new Date(),
        });
      }
      setSubmitting(false);
      if (onSave) onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user details:', error);
      setSubmitting(false);
      // Optionally, set an error state to display to the user
    }
  };

  const currentQuestion = questions[activeStep];

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <AnimatedTypography variant="h5">
          {existingData ? 'Edit Your Details' : 'Complete Your Profile'}
        </AnimatedTypography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {questions.map((_, index) => (
            <Step key={index}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>

        <Fade in={true} timeout={500}>
          <Box>
            <AnimatedTypography
              variant="h6"
              gutterBottom
              style={{
                opacity: 1,
                transform: 'translateY(0)',
              }}
            >
              {currentQuestion.label}
            </AnimatedTypography>

            <FormControl fullWidth error={!!errors[currentQuestion.field]}>
              {currentQuestion.type === 'select' ? (
                <Select
                  value={formData[currentQuestion.field]}
                  onChange={(e) => handleChange(currentQuestion.field, e.target.value)}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: '#333', // Dark background
                    color: '#fff', // White text
                    '& .MuiSelect-select': {
                      padding: '12px 14px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#555', // Darker border
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  displayEmpty
                  inputProps={{
                    'aria-label': currentQuestion.label,
                  }}
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  {currentQuestion.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              ) : currentQuestion.type === 'radio' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Radio
                          checked={formData[currentQuestion.field] === option}
                          onChange={() => handleChange(currentQuestion.field, option)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                          {option}
                        </Typography>
                      }
                    />
                  ))}
                </Box>
              ) : (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={formData[currentQuestion.field]}
                  onChange={(e) => handleChange(currentQuestion.field, e.target.value)}
                  sx={{
                    mt: 2,
                    backgroundColor: '#333', // Dark background
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff', // White text
                      '& fieldset': {
                        borderColor: '#555', // Darker border
                      },
                      '&:hover fieldset': {
                        borderColor: '#777',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#aaa', // Light label
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#aaa', // Light placeholder
                      opacity: 1,
                    },
                  }}
                  placeholder="Enter your answer"
                  inputProps={{
                    'aria-label': currentQuestion.label,
                  }}
                />
              )}
              {errors[currentQuestion.field] && (
                <Typography color="error" variant="caption">
                  {errors[currentQuestion.field]}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Fade>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.light,
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            Back
          </Button>
          <StyledButton
            onClick={activeStep === questions.length - 1 ? handleSubmit : handleNext}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : (activeStep === questions.length - 1 ? 'Submit' : 'Next')}
          </StyledButton>
        </Box>
      </DialogActions>
    </StyledDialog>
  );
};

export default UserDetailsModal;
