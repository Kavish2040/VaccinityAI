// app/pharmacy-dashboard/page.js

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import {
  initializeApp
} from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';

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
const db = getFirestore(app);

const drawerWidth = 240;

// Material-UI theme customization
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A1A',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2A2A2A',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#2A2A2A',
          '&::before': {
            display: 'none',
          },
        },
      },
    },
  },
});

export default function PharmacyDashboard() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkingUserType, setCheckingUserType] = useState(true);
  const [loading, setLoading] = useState(true);
  const [matchingStudies, setMatchingStudies] = useState([]);
  
  const [pharmacyNameError, setPharmacyNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  // New state for message sending
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const userType = user.unsafeMetadata?.userType;
        console.log('CompleteSignup: userType =', userType);

        if (userType === 'pharmacy') {
          console.log('User is a pharmacy');
          setCheckingUserType(false);
        } else if (userType === 'patient') {
          console.log('Redirecting to /dashboard');
          router.push('/dashboard');
          setLoading(false);
        } else if (userType === undefined) {
          console.log('Redirecting to /complete-signup');
          router.push('/complete-signup');
          setLoading(false);
        } else {
          console.log('Redirecting to /');
          router.push('/');
          setLoading(false);
        }
      } else {
        console.log('Redirecting to /sign-in');
        router.push('/sign-in');
        setLoading(false);
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const checkPharmacyName = async () => {
      if (user) {
        try {
          console.log('User ID:', user.id);
          const userDocRef = doc(db, 'Pharmacy', user.id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.pharmacyName) {
              setPharmacyName(data.pharmacyName);
              console.log('Pharmacy Name:', data.pharmacyName);
              setIsModalOpen(false);
            } else {
              console.log('Pharmacy name is missing, opening modal.');
              setIsModalOpen(true);
            }
          } else {
            console.log('Pharmacy document does not exist for user ID:', user.id);
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error('Error fetching pharmacy data:', error);
        } finally {
          console.log('Setting loading to false in checkPharmacyName');
          setLoading(false);
        }
      } else {
        console.log('User is undefined in checkPharmacyName, setting loading to false');
        setLoading(false);
      }
    };

    if (!checkingUserType) {
      checkPharmacyName();
    }
  }, [user, checkingUserType]);

  useEffect(() => {
    const fetchMatchingStudies = async () => {
      if (pharmacyName) {
        setLoading(true);
        console.log('Loading set to true in fetchMatchingStudies');
        try {
          const studiesRef = collection(db, 'savedStudies');
          const standardizedPharmacyName = pharmacyName.trim().toLowerCase();
          console.log('Querying for leadSponsor:', standardizedPharmacyName);
          const q = query(studiesRef, where('leadSponsor'.trim(), '==', standardizedPharmacyName));
          const querySnapshot = await getDocs(q);
          const studies = [];
          querySnapshot.forEach((doc) => {
            studies.push({ id: doc.id, ...doc.data() });
          });
          console.log('Matching Studies:', studies);
          setMatchingStudies(studies);
        } catch (error) {
          console.error('Error fetching matching studies:', error);
        } finally {
          console.log('Setting loading to false in fetchMatchingStudies');
          setLoading(false);
        }
      } else {
        console.log('Pharmacy name is undefined in fetchMatchingStudies');
        setLoading(false);
      }
    };

    if (pharmacyName) {
      fetchMatchingStudies();
    }
  }, [pharmacyName]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ color: 'white' }}>
      <Toolbar />
      <List>
        {[
          { text: 'Home', icon: <HomeIcon />, onClick: () => router.push('/') },
          { text: 'Logout', icon: <LogoutIcon />, onClick: () => router.push('/sign-out') },
        ].map((item) => (
          <ListItem button key={item.text} onClick={item.onClick}>
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handlePharmacyNameSubmit = async () => {
    const standardizedPharmacyName = pharmacyName.trim().toLowerCase();

    if (standardizedPharmacyName === '') {
      setPharmacyNameError('Please enter the name of the pharmacy.');
      return;
    }

    setPharmacyNameError('');
    setIsSubmitting(true);

    try {
      const pharmaciesRef = collection(db, 'Pharmacy');
      const q = query(pharmaciesRef, where('pharmacyName', '==', standardizedPharmacyName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSnackbar({
          open: true,
          message: 'Pharmacy name already taken. Please choose another name.',
          severity: 'error',
        });
        return;
      }

      const userDocRef = doc(db, 'Pharmacy', user.id);
      await setDoc(userDocRef, { pharmacyName: standardizedPharmacyName }, { merge: true });
      console.log('Saved Pharmacy Name:', standardizedPharmacyName);
      setPharmacyName(standardizedPharmacyName);
      setIsModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Pharmacy name successfully saved!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error saving pharmacy name:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while saving the pharmacy name. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // New function to handle sending a message
  const handleSendMessage = async (userId) => {
    if (!messageText.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a message.',
        severity: 'error',
      });
      return;
    }

    setSendingMessage(true);
    try {
      const messageData = {
        senderId: user.id,
        receiverId: userId,
        message: messageText.trim(),
        timestamp: serverTimestamp(),
        read: false,
      };

      await addDoc(collection(db, 'messages'), messageData);

      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success',
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  console.log('Rendering component, checkingUserType:', checkingUserType, 'loading:', loading);

  if (checkingUserType || loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Pharmacy Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {pharmacyName}
          </Typography>

          <Typography variant="h5" sx={{ mb: 3 }}>
            Users Matching Your Studies
          </Typography>

          {matchingStudies.length === 0 ? (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              No users have matched with your studies yet.
            </Typography>
          ) : (
            <Paper elevation={3} sx={{ p: 2, backgroundColor: "#000000" }}>
              {matchingStudies.map((study) => (
                <Accordion key={study.id} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    aria-controls={`panel-${study.id}-content`}
                    id={`panel-${study.id}-header`}
                  >
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {study.userName || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {study.timestamp && study.timestamp.toDate
                        ? new Date(study.timestamp.toDate()).toLocaleString()
                        : 'No Timestamp Available'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Study Title: {study.simplifiedTitle.toUpperCase()}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Match Result: {study.matchResult?.match ? 'Matched' : 'Not Matched'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Explanation: {study.matchResult?.explanation || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Questions and Answers:
                    </Typography>
                    {study.questions && study.answers && study.questions.length === study.answers.length ? (
                      study.questions.map((q, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Q{index + 1}: {q.text}
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            A: {study.answers[index]}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        No questions and answers available.
                      </Typography>
                    )}
                    {/* New Message Sending UI */}
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        label="Send a message"
                        variant="outlined"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        sx={{
                          mr: 1,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                      <Fab
                        color="primary"
                        aria-label="send"
                        onClick={() => handleSendMessage(study.userId)}
                        disabled={sendingMessage}
                        sx={{
                          width: 56,
                          height: 56,
                          minHeight: 56,
                        }}
                      >
                        {sendingMessage ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <SendIcon />
                        )}
                      </Fab>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          )}
        </Box>
      </Box>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen}>
        <DialogTitle>Enter Pharmacy Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the pharmacy sponsoring.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Pharmacy Name"
            type="text"
            fullWidth
            variant="outlined"
            value={pharmacyName}
            onChange={(e) => setPharmacyName(e.target.value)}
            error={Boolean(pharmacyNameError)}
            helperText={pharmacyNameError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePharmacyNameSubmit} color="primary" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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
    </ThemeProvider>
  );
}