'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
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
      paper: '#333', // Changed to a darker shade for a more cohesive color scheme
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
      <Toolbar> 
        <Typography variant="h5" sx={{mr:1, fontWeight: 'bold',  }}>
          {user ? `${user.firstName || ' '}` : ' '}  
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', }}>
          {user ? `${user.lastName || ''}` : ' '}
        </Typography>
      </Toolbar>
      <List sx={{borderTop: '1px solid #FFF',}}>
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
            <Typography 
              variant="h5" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#000000', 
                letterSpacing: '0.5px', 
                textTransform: 'uppercase', 
                mb: 2,
                mt: 2,
                fontSize: '1.5rem', 
              }}
            >
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
              { title: 'Clinical Trials', description: 'Access and get live updates of clinical trials.', link: '/generate' },
            ].map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                    '&:hover': { 
                      transform: 'scale(1.05)', 
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                      backgroundColor: '#1a1a1a', // Slightly change background color on hover
                    },
                    cursor: 'pointer', // Change the cursor to pointer for better UX
                    backgroundColor: '#2d2d2d', // Set a consistent background color
                    color: '#ffffff', // Ensure text color contrasts with the background
                  }}
                >
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
