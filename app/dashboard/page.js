// app/components/Dashboard.js

"use client";

import { useState, useEffect } from 'react';
import { useRouter,  useSearchParams } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';

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
  Avatar,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  TextField,
  CircularProgress,
  InputAdornment,
  Badge,
  Button,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import SearchIcon from '@mui/icons-material/Search';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

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
  documentId,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

import UserDetailsModal from '../components/UserDetailsModal'; // Corrected import path

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
      main: '#1976d2', // Primary color
    },
    secondary: {
      main: '#ff4081', // Secondary color
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
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
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.2)', // Primary color
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.3)',
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
  const { openUserProfile } = useClerk();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedStudies, setSavedStudies] = useState([]);
  const [loadingStudies, setLoadingStudies] = useState(true);
  const [checkingUserType, setCheckingUserType] = useState(true);

  // State for messaging
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openMessagesDialog, setOpenMessagesDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const openProfileMenu = Boolean(anchorEl);

  const [senders, setSenders] = useState({});

  const [searchTerm, setSearchTerm] = useState('');

  // New State for User Entry Details
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // State for Edit Details Modal
  const [editOpen, setEditOpen] = useState(false);
  // State for Initial Details Modal
  const [initialDetailsModalOpen, setInitialDetailsModalOpen] = useState(false);

  const [condition, setCondition] = useState('');

  useEffect(() => {
    const conditionParam = searchParams.get('condition');
    if (conditionParam) {
      setCondition(conditionParam);
    } else if (userDetails && userDetails.condition) {
      setCondition(userDetails.condition);
    }
  }, [searchParams, userDetails]);
  // Handle Drawer Toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Handle Profile Menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    openUserProfile();
    handleProfileMenuClose();
  };
  const handleSettings = () => {
    router.push('/settings');
    handleProfileMenuClose();
  };

  // Drawer Content
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
          { text: 'Get Genetic Testing Results', icon: <DocumentScannerIcon />, onClick: () => router.push('/genetic-testing') },
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
          { text: 'Logout', icon: <LogoutIcon /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <SignOutButton>
              <ListItemButton>
                <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </SignOutButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
    let intervalId;
  
    const fetchMessages = async () => {
      if (!user?.id) {
        console.log('User not found, cannot fetch messages');
        return;
      }
  
      console.log('Fetching messages for user ID:', user.id);
  
      try {
        const messagesQuery = query(
          collection(db, 'messages'),
          where('receiverId', '==', user.id)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
  
        const msgs = [];
        let unread = 0;
        const senderIdsToFetch = new Set();
  
        messagesSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            ...data,
            timestamp: data.timestamp && data.timestamp.toDate
              ? data.timestamp.toDate().toLocaleString()
              : (typeof data.timestamp === 'string' ? data.timestamp : 'Unknown date')
          });
  
          if (!data.read) unread += 1;
  
          if (data.senderId) {
            senderIdsToFetch.add(data.senderId);
          }
        });
  
        let sendersMap = {};
        if (senderIdsToFetch.size > 0) {
          const senderIdsArray = Array.from(senderIdsToFetch);
          const chunkSize = 10;
          const senderChunks = [];
  
          for (let i = 0; i < senderIdsArray.length; i += chunkSize) {
            senderChunks.push(senderIdsArray.slice(i, i + chunkSize));
          }
  
          for (const chunk of senderChunks) {
            const sendersQuery = query(
              collection(db, 'Pharmacy'),
              where(documentId(), 'in', chunk)
            );
            const sendersSnapshot = await getDocs(sendersQuery);
  
            sendersSnapshot.forEach((doc) => {
              sendersMap[doc.id] = doc.data().pharmacyName.toUpperCase() || 'UNKNOWN PHARMACY';
            });
          }
        }
  
        const mappedMessages = msgs.map((msg) => ({
          ...msg,
          senderName: sendersMap[msg.senderId] || 'UNKNOWN PHARMACY',
        }));
  
        mappedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMessages(mappedMessages);
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching messages: ', error);
        setMessages([]);
        setUnreadCount(0);
      }
    };
  
    if (user) {
      fetchMessages(); // Fetch immediately
      intervalId = setInterval(fetchMessages, 10 * 60 * 1000); // Fetch every 5 minutes
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);
  

  // Fetch notifications
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
            timestamp: data.timestamp && data.timestamp.toDate
              ? data.timestamp.toDate().toLocaleString()
              : (typeof data.timestamp === 'string' ? data.timestamp : 'Unknown date')
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

  // Fetch User Entry Details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;

      try {
        const q = query(
          collection(db, 'UserEntryDetails'),
          where('userId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setUserDetails(docSnap.data());
        } else {
          // Open the initial modal if details are missing
          setInitialDetailsModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoadingDetails(false);
      }
    };

    if (user) {
      fetchUserDetails();
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

  // Filtered saved studies based on search term
  const filteredStudies = savedStudies.filter((study) =>
    study.simplifiedTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Handle saving user details from the modal
  const handleSaveUserDetails = (newDetails) => {
    setUserDetails(newDetails);
    // Close the initial modal if it was open
    if (initialDetailsModalOpen) {
      setInitialDetailsModalOpen(false);
    }
    // You can also refresh other parts of the dashboard if necessary
  };

  if (checkingUserType || loadingStudies || loadingDetails) {
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

            {/* Search Bar */}
            <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#2A2A2A',
                    borderRadius: 1,
                    color: 'white',
                  },
                }}
              />
            </Box>

            {/* Messages Icon with Badge */}
            <Tooltip title="Messages">
              <IconButton color="inherit" onClick={handleOpenMessagesDialog}>
                <Badge badgeContent={unreadCount} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {/* Notifications Icon with Badge */}
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
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
                {user?.imageUrl ? (
                  <Avatar src={user.imageUrl} alt={user.fullName || 'User'} />
                ) : (
                  <AccountCircle />
                )}
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
              <MenuItem>
                <SignOutButton>
                  <Typography>Logout</Typography>
                </SignOutButton>
              </MenuItem>
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
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 4 }}>
                <Avatar
                  src={user?.imageUrl}
                  alt={user?.fullName || 'User'}
                  sx={{ width: 64, height: 64, mb: 2 }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                >
                  Welcome back, {user?.fullName || 'User'}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {user?.primaryEmailAddress?.emailAddress || 'No Email Provided'}
                </Typography>
                {user?.primaryPhoneNumber && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {user.primaryPhoneNumber.phoneNumber}
                  </Typography>
                )}

                {/* Display User Entry Details */}
                {!loadingDetails && userDetails && (
                  <Box sx={{ mt: 3, width: '100%', maxWidth: 600 }}>
                    <Card sx={{ backgroundColor: '#2A2A2A', padding: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                          Your Details
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setEditOpen(true)}
                        >
                          Edit Details
                        </Button>
                      </Box>
                      <Grid container spacing={2}>
                      
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Type of Cancer:
                          </Typography>
                          <Typography variant="body1">{userDetails.typeOfCancer}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Stage:
                          </Typography>
                          <Typography variant="body1">{userDetails.stage}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Chemotherapy:
                          </Typography>
                          <Typography variant="body1">{userDetails.chemotherapy}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Radiation Therapy:
                          </Typography>
                          <Typography variant="body1">{userDetails.radiation}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Other Treatment:
                          </Typography>
                          <Typography variant="body1">{userDetails.otherTreatment}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Gender:
                          </Typography>
                          <Typography variant="body1">{userDetails.gender}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Ethnicity:
                          </Typography>
                          <Typography variant="body1">{userDetails.ethnicity}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Condition:
                          </Typography>
                          <Typography variant="body1">{condition}</Typography>
                        </Grid>
                       
 
                      </Grid>
                    </Card>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Summary Cards */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
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
                        {savedStudies.filter(study => study.matchResult?.match).length}
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
              </Grid>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activities
                  </Typography>
                  <List>
                    {messages.slice(0, 5).map((msg) => (
                      <ListItem key={msg.id}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {msg.senderName.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={`Message from ${msg.senderName}`}
                          secondary={msg.timestamp}
                        />
                      </ListItem>
                    ))}
                    {savedStudies.slice(0, 5).map((study) => {
                      const studyDate = study.timestamp ? new Date(study.timestamp.seconds * 1000) : null;
                      const shortenedTitle = study.simplifiedTitle.length > 80 
                        ? study.simplifiedTitle.substring(0, 80) + '...' 
                        : study.simplifiedTitle; // Show first 80 characters, add ellipsis if longer

                      return (
                        <ListItem key={study.id}>
                          <ListItemIcon>
                            <ScienceIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            // Only display the first 80 characters of the title
                            primary={`Saved Study: ${shortenedTitle}`}
                            secondary={studyDate ? studyDate.toLocaleString() : 'No date available'}
                          />
                        </ListItem>
                      );
                    })}
                    {notifications.slice(0, 5).map((notif) => (
                      <ListItem key={notif.id}>
                        <ListItemIcon>
                          <NotificationsIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={notif.title}
                          secondary={notif.timestamp}
                        />
                      </ListItem>
                    ))}
                    {messages.length === 0 && savedStudies.length === 0 && notifications.length === 0 && (
                      <Typography>No recent activities to display.</Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Saved Studies Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                      }}
                    >
                      Your Saved Studies
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ScienceIcon />}
                      onClick={() => router.push('/generate')}
                    >
                      Add New Study
                    </Button>
                  </Box>
                  {loadingStudies ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '150px',
                      }}
                    >
                      <CircularProgress color="primary" />
                    </Box>
                  ) : filteredStudies.length === 0 ? (
                    <Typography>No saved studies found.</Typography>
                  ) : (
                    <List>
                      {filteredStudies.map((study) => (
                        <ListItem
                          key={study.id}
                          secondaryAction={
                            <Box>
                              <Tooltip title="View Study">
                                <IconButton
                                  edge="end"
                                  color="primary"
                                  onClick={() => router.push(`/study/${study.id}`)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Study">
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() => handleDeleteStudy(study.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={
                              study.simplifiedTitle.charAt(0).toUpperCase() + study.simplifiedTitle.substring(1)
                            }
                            secondary={`Match: ${study.matchResult?.match ? 'Yes' : 'No'}`}
                            primaryTypographyProps={{ fontWeight: 'medium' }}
                            secondaryTypographyProps={{
                              color: study.matchResult?.match ? 'success.main' : 'error.main',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Sections (e.g., Upcoming Appointments) */}
            {/* You can add more sections here as needed */}
          </Grid>
        </Box>
      </Box>

      {/* Initial User Details Modal */}
      <UserDetailsModal
        open={initialDetailsModalOpen}
        onClose={() => setInitialDetailsModalOpen(false)}
        existingData={null}
        onSave={handleSaveUserDetails}
      />

      {/* Edit Details Modal */}
      <UserDetailsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        existingData={userDetails}
        onSave={handleSaveUserDetails}
      />

      {/* Messages Dialog */}
      <Dialog
        open={openMessagesDialog}
        onClose={handleCloseMessagesDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Inbox</DialogTitle>
        <DialogContent dividers>
          {messages.length === 0 ? (
            <Typography>No messages to display.</Typography>
          ) : (
            <List>
              {messages.map((msg) => (
                <ListItemButton
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  sx={{
                    backgroundColor: msg.read ? 'inherit' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    mb: 1,
                    p: 1,
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {msg.senderName.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={`Subject: ${msg.subject}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          From: {msg.senderName}
                        </Typography>
                        {" — " + (msg.message.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message)}
                      </>
                    }
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
        <Dialog
          open={Boolean(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Message from {selectedMessage.senderName}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Sent:</strong> {selectedMessage.timestamp}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Subject: {selectedMessage.subject}
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
