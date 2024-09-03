// Dashboard.js
'use client'
// Dashboard.js
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Always use this import for useRouter
import { useUser } from '@clerk/nextjs';

import {
  AppBar,
  Box,
  Button,
  Container,
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
  CardActionArea,
  CardContent,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import StudyIcon from '@mui/icons-material/Book'; // This should be an actual icon from @mui/icons

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#121212',
      paper: '#424242',
    },
    
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: drawerWidth,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          alignItems: 'center',
        },
      },
    },
    
  },
});

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();  
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar > 

      <Typography variant="h5" sx={{mr:1, }}>
      {user ? `${user.firstName || ' '}` : ' '}  
            </Typography>

            <Typography variant="h5" >
      {user ? `${user.lastName || 'there'}` : ' '}
            </Typography>

      </Toolbar>
      <List sx={{borderTop: '1px solid #FFF'}}>
        {[
          { text: 'Home', icon: <HomeIcon />, onClick: () => router.push('/') },
          { text: 'Logout', icon: <LogoutIcon />, onClick: () => router.push('/') },
        ].map((item, index) => (
          <ListItem button key={item.text} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', backgroundColor:"" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: `calc(100% - ${drawerWidth}px)`,  backgroundColor: '#00A36C', }}>
          <Toolbar>
            <Typography variant="h5" noWrap component="div">
             Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }}}>
          <Toolbar />
          <Grid container spacing={3}>
            {/* Example cards for different sections */}
            {[
              { title: 'Patient Data', description: 'View and manage patient data.', link: '/patientdata' },
              { title: 'Clinical Trials', description: 'Access and get live update clinical trials.', link: '/generate' },
            ].map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => router.push(card.link)}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
