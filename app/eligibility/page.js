"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container, Typography, TextField, Button, Box, CircularProgress,
  AppBar, Toolbar, IconButton, LinearProgress, ThemeProvider,
  createTheme, CssBaseline, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser for user details
import FloatingChatbot from '@/app/chatbot/FloatingChatbot';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZHFXSsCxazH6tnZBxwmzMtMQluVHRWtc",
  authDomain: "vaccinityai-7941b.firebaseapp.com",
  projectId: "vaccinityai-7941b",
  storageBucket: "vaccinityai-7941b.appspot.com",
  messagingSenderId: "1011572729936",
  appId: "1:1011572729936:web:97103ef7f3c638f2a20955",
  measurementId: "G-J0JVXZ72HD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

// Custom theme for MUI components
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8B5CF6' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#FFFFFF', secondary: '#B0B0B0' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default function Eligibility() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser(); // Clerk user data
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchResult, setMatchResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch eligibility criteria and corresponding questions
  useEffect(() => {
    const eligibilityCriteriaParam = searchParams.get('eligibilityCriteria');
    if (eligibilityCriteriaParam) {
      try {
        const decodedParam = decodeURIComponent(eligibilityCriteriaParam);
        setEligibilityCriteria(decodedParam);
        fetchQuestions(decodedParam);
      } catch (error) {
        console.error('Error decoding eligibility criteria:', error);
        setEligibilityCriteria(eligibilityCriteriaParam);
        fetchQuestions(eligibilityCriteriaParam);
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  // Fetch questions based on eligibility criteria
  const fetchQuestions = async (criteria) => {
    setLoading(true);
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria }),
      });

      if (!response.ok) throw new Error(`Error fetching questions: ${response.statusText}`);

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        const filteredQuestions = data.questions.map(q => ({ text: q.text, selected: false }));
        setQuestions(filteredQuestions);
        setAnswers(new Array(filteredQuestions.length).fill(''));
        setProgress(0);
      } else {
        console.error("Unexpected response format from /api/openai");
        setQuestions([]);
        setAnswers([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  // Update answers and track progress
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
    const filled = updatedAnswers.filter(a => a.trim() !== '').length;
    setProgress((filled / questions.length) * 100);
  };

  // Submit answers and get match result
  const handleSubmit = async () => {
    if (answers.some(a => a.trim() === '')) {
      setSnackbarMessage("Please answer all questions before submitting.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    try {
      // Modify the questions to send only the text
      const questionsTexts = questions.map(q => q.text);

      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsTexts, answers, eligibilityCriteria }),
      });

      if (!response.ok) throw new Error(`Error fetching response: ${response.statusText}`);

      const data = await response.json();
      setMatchResult(data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error in submission:', error);
      setSnackbarMessage("Error processing your answers. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Save the study and user data to Firebase
  const handleSaveStudy = async () => {
    if (!matchResult || !user?.id) return;
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, "savedStudies"), {
        eligibilityCriteria,
        questions, // You might want to save only the texts here as well
        answers,
        matchResult,
        timestamp: new Date(),
        userId: user.id,
      });
      console.log("Document written with ID: ", docRef.id);
      setSnackbarMessage("Study saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setDialogOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      setSnackbarMessage("Error saving study. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pb: 10 }}> {/* Padding to accommodate fixed save bar */}
        {/* App Bar */}
        <AppBar position="sticky" sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              Clinical Trial Eligibility
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
            Eligibility Criteria Questions
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : (
            <>
              {/* Progress Bar */}
              <Box sx={{ mb: 4 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5,  backgroundColor: '#e0e0e0', // Optional: Light gray track color
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4caf50', // Green bar color
    },  }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                  {`${Math.round(progress)}% Complete`}
                </Typography>
              </Box>
              
              {/* Questions and Answers */}
              {questions.map((question, index) => (
                <Box key={index} sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {question.text}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here"
                    multiline
                    rows={3}
                  />
                </Box>
              ))}

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={progress !== 100}
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Submit Answers
                </Button>
              </Box>
            </>
          )}
        </Container>

        {/* Modal Dialog for Match Result */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="match-result-dialog-title"
          aria-describedby="match-result-dialog-description"
        >
          <DialogTitle id="match-result-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
            {matchResult?.match ? (
              <>
                <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                Match Found
              </>
            ) : (
              <>
                <CancelOutlinedIcon color="error" sx={{ mr: 1 }} />
                No Match
              </>
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="match-result-dialog-description">
              {matchResult?.explanation || "No additional information provided."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!matchResult?.match ? (
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
            ) : (
              <Button
                onClick={handleSaveStudy}
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Study'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      <FloatingChatbot />
    </ThemeProvider>
  );
}
