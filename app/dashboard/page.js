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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ListItemButton,
  Avatar,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ScienceIcon from '@mui/icons-material/Science';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid } from 'recharts';

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

const drawerWidth = 280;

// Material-UI theme customization
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E88E5',
    },
    secondary: {
      main: '#FF7043',
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
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(30, 136, 229, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(30, 136, 229, 0.3)',
            },
          },
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

  // State for messaging
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openMessagesDialog, setOpenMessagesDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // State for Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfileMenu = Boolean(anchorEl);

  useEffect(() => {
    console.log('Current user ID:', user?.id);
  }, [user]);

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
          router.push('/pharmacy-dashboard');
        } else if (userType === undefined) {
          console.warn('User type is undefined. Redirecting to complete-signup.');
          router.push('/complete-signup');
        } else {
          console.warn('User type is invalid. Redirecting to home.');
          router.push('/');
        }
      } else {
        router.push('/sign-in');
      }
    }
  }, [isLoaded, user, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          VaccinityAI
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {[
          { text: 'Home', icon: <HomeIcon />, onClick: () => router.push('/') },
          { text: 'Clinical Trials', icon: <ScienceIcon />, onClick: () => router.push('/generate') },
          // Add more navigation items here
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[
          { text: 'Logout', icon: <LogoutIcon />, onClick: () => router.push('/sign-out') },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
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
    // Add more dashboard items as needed
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

  // Fetch messages for the patient
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) {
        console.log('User not found, cannot fetch messages');
        return;
      }

      console.log('Fetching messages for user ID:', user.id);

      try {
        const q = query(
          collection(db, 'messages'),
          where('receiverId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);

        console.log('Query snapshot size:', querySnapshot.size);

        const msgs = [];
        let unread = 0;
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          console.log('Message data:', data);

          msgs.push({
            id: doc.id,
            ...data,
            senderName: data.senderId, // Ideally, fetch sender's name
            timestamp: data.timestamp && data.timestamp.toDate ?
              data.timestamp.toDate().toLocaleString() :
              (typeof data.timestamp === 'string' ? data.timestamp : 'Unknown date')
          });

          if (!data.read) unread += 1;
        }

        // Sort messages by timestamp string (newest first)
        msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log('Processed messages:', msgs);
        setMessages(msgs);
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching messages: ', error);
        setMessages([]);
        setUnreadCount(0);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  // Fetch notifications (similar to messages)
  useEffect(() => {
    const fetchNotifications = () => {
      if (!user?.id) return;

      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.id)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifs = [];
        let unread = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notifs.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp && data.timestamp.toDate ?
              data.timestamp.toDate().toLocaleString() :
              (typeof data.timestamp === 'string' ? data.timestamp : 'Unknown date')
          });
          if (!data.read) unread += 1;
        });
        // Sort notifications by timestamp descending
        notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setNotifications(notifs);
        setUnreadNotifications(unread);
      }, (error) => {
        console.error('Error fetching notifications:', error);
      });

      return () => unsubscribe();
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Handle opening the Messages Dialog
  const handleOpenMessagesDialog = () => {
    setOpenMessagesDialog(true);
    markAllMessagesAsRead();
  };

  // Handle closing the Messages Dialog
  const handleCloseMessagesDialog = () => {
    setOpenMessagesDialog(false);
    setSelectedMessage(null);
  };

  // Handle selecting a message to view
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  };

  // Mark a single message as read
  const markMessageAsRead = async (messageId) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { read: true });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Mark all messages as read
  const markAllMessagesAsRead = async () => {
    try {
      const unreadMessages = messages.filter((msg) => !msg.read);
      const batch = db.batch();
      unreadMessages.forEach((msg) => {
        const msgRef = doc(db, 'messages', msg.id);
        batch.update(msgRef, { read: true });
      });
      await batch.commit();
      setMessages((prevMessages) =>
        prevMessages.map((msg) => ({ ...msg, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  // Handle deleting a study
  const handleDeleteStudy = async (id) => {
    try {
      await deleteDoc(doc(db, 'savedStudies', id));
      setSavedStudies(savedStudies.filter((study) => study.id !== id));
    } catch (error) {
      console.error('Error deleting study: ', error);
    }
  };

  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    router.push('/profile');
    handleProfileMenuClose();
  };
  const handleSettings = () => {
    router.push('/settings');
    handleProfileMenuClose();
  };

  if (checkingUserType) {
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
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Dashboard
            </Typography>
            {/* Notifications Icon */}
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={unreadNotifications} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {/* Messages Icon with Badge */}
            <Tooltip title="Messages">
              <IconButton color="inherit" onClick={handleOpenMessagesDialog}>
                <Badge badgeContent={unreadCount} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {/* User Profile */}
            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{ ml: 2 }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={openProfileMenu}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleSettings}>Settings</MenuItem>
              <MenuItem onClick={() => router.push('/sign-out')}>Logout</MenuItem>
            </Menu>
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
            p: 4,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <Grid container spacing={4}>
            {/* Welcome Message */}
            <Grid item xs={12}>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Welcome back, {user?.firstName || 'User'}!
              </Typography>
            </Grid>

            {/* Analytics Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Studies
                  </Typography>
                  <Typography variant="h4">
                    {savedStudies.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Trials
                  </Typography>
                  <Typography variant="h4">
                    {/* Placeholder number */}
                    0
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    New Messages
                  </Typography>
                  <Typography variant="h4">
                    {unreadCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <Typography variant="h4">
                    {unreadNotifications}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activities
                  </Typography>
                  <List>
                    {/* Placeholder activities */}
                    <ListItem>
                      <ListItemText primary="Joined a new study: COVID-19 Vaccine Trial" secondary="2 hours ago" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Received a message from Pharmacy" secondary="1 day ago" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Updated profile information" secondary="3 days ago" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Saved Studies Section */}
            <Grid item xs={12}>
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
              {loadingStudies ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                  }}
                >
                  <CircularProgress color="primary" />
                </Box>
              ) : savedStudies.length === 0 ? (
                <Typography>No saved studies found.</Typography>
              ) : (
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
                            boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Study ID: {study.simplifiedTitle}
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
                            <Tooltip title="View Study">
                              <IconButton
                                color="primary"
                                onClick={() => router.push(`/study/${study.id}`)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Study">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteStudy(study.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Messages Dialog */}
      <Dialog open={openMessagesDialog} onClose={handleCloseMessagesDialog} fullWidth maxWidth="md">
        <DialogTitle>Inbox</DialogTitle>
        <DialogContent dividers>
          {messages.length === 0 ? (
            <Typography>No messages to display.</Typography>
          ) : (
            <List>
              {messages.map((msg) => (
                <ListItemButton key={msg.id} onClick={() => handleSelectMessage(msg)}>
                  <ListItemText
                    primary={`From: ${msg.senderName}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {typeof msg.timestamp === 'string' ? msg.timestamp : 'Unknown date'}
                        </Typography>
                        {" — " + msg.message.slice(0, 50) + '...'}
                      </>
                    }
                    sx={{
                      backgroundColor: msg.read ? 'inherit' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      mb: 1,
                      p: 1,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessagesDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Selected Message Dialog */}
      {selectedMessage && (
        <Dialog open={Boolean(selectedMessage)} onClose={() => setSelectedMessage(null)} fullWidth maxWidth="sm">
          <DialogTitle>Message from Pharmacy</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              <strong>From:</strong> {selectedMessage.senderName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Sent:</strong> {typeof selectedMessage.timestamp === 'string' ? selectedMessage.timestamp : 'Unknown date'}
            </Typography>
            <Typography variant="body1">
              {selectedMessage.message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedMessage(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ThemeProvider>
  );
}
