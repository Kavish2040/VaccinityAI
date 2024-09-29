// app/dashboard/page.js
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
  Grid,
  Card,
  CardContent,
  IconButton,
  Paper,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ScienceIcon from '@mui/icons-material/Science';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2A2A2A',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default function Dashboard() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedStudies, setSavedStudies] = useState([]);
  const [loadingStudies, setLoadingStudies] = useState(true);
  const [checkingUserType, setCheckingUserType] = useState(true);

  // Check if the user is a patient; redirect if not
  useEffect(() => {
    if (isLoaded) {
      console.log('Dashboard: User is loaded:', user);
      if (user) {
        const userType = user.unsafeMetadata?.userType;
        console.log('Dashboard: User type:', userType);

        if (userType === 'patient') {
          setCheckingUserType(false);
        } else if (userType === 'pharmacy') {
          // Redirect pharmacy users to their dashboard
          router.push('/pharmacy-dashboard');
        } else if (userType === undefined) {
          console.warn('User type is undefined. Redirecting to complete-signup.');
          router.push('/complete-signup');
        } else {
          console.warn('User type is invalid. Redirecting to home.');
          router.push('/');
        }
      } else {
        // If no user is logged in, redirect to sign-in page
        router.push('/sign-in');
      }
    }
  }, [isLoaded, user, router]);

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

  const dashboardItems = [
    {
      title: 'Clinical Trials',
      description: 'Access and monitor ongoing clinical trials',
      icon: <ScienceIcon fontSize="large" />,
      link: '/generate',
    },
  ];

  // Fetch saved studies from Firebase
  useEffect(() => {
    const fetchSavedStudies = async () => {
      if (!user?.id) {
        console.log('User not found, cannot fetch saved studies');
        return;
      }

      setLoadingStudies(true);
      try {
        const q = query(
          collection(db, 'savedStudies'),
          where('userId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No saved studies found for this user.');
        }

        const studies = [];
        querySnapshot.forEach((doc) => {
          studies.push({ id: doc.id, ...doc.data() });
        });
        setSavedStudies(studies);
      } catch (error) {
        console.error('Error fetching saved studies: ', error);
      } finally {
        setLoadingStudies(false);
      }
    };

    if (user) {
      fetchSavedStudies();
    }
  }, [user]);

  // Handle deleting a study
  const handleDeleteStudy = async (id) => {
    try {
      await deleteDoc(doc(db, 'savedStudies', id));
      setSavedStudies(savedStudies.filter((study) => study.id !== id));
    } catch (error) {
      console.error('Error deleting study: ', error);
    }
  };

  if (checkingUserType) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
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
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
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

        {/* Main Content */}
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
            Welcome back, {user?.firstName || 'User'}!
          </Typography>

          {/* Dashboard Items */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {dashboardItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent
                    sx={{ p: 3, cursor: 'pointer' }}
                    onClick={() => router.push(item.link)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {item.icon}
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ ml: 2 }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Saved Studies Section */}
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            Your Saved Studies
          </Typography>
          <Grid container spacing={3}>
            {savedStudies.map((study) => (
              <Grid item xs={12} sm={6} md={4} key={study.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition:
                      'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Study ID: {study.id.slice(0, 8)}...
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                    {study.eligibilityCriteria.slice(0, 100)}...
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: study.matchResult.match
                          ? 'success.main'
                          : 'error.main',
                      }}
                    >
                      Match: {study.matchResult.match ? 'Yes' : 'No'}
                    </Typography>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => router.push(`/study/${study.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteStudy(study.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
