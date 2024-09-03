"use client";
import { Container, Grid, Card, Typography, Paper, TextField, Button, CardContent, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogContentText, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 

const theme = createTheme({
    palette: {
        background: {
            default: '#000000',
        },
        text: {
            primary: '#FFFFFF',
        },
    },
});

export default function Generate() {
    const { user } = useUser();
    const [studies, setStudies] = useState([]);
    const [text, setText] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [intervention, setIntervention] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(true);
    const studiesPerPage = 6;
    const router = useRouter();

    const handleTextChange = (event) => setText(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value);
    const handleLocationChange = (event) => setLocation(event.target.value);
    const handleInterventionChange = (event) => setIntervention(event.target.value);

    const handleSubmit = async () => {
        setLoading(true);
        
        // Prepare the request body
        const bodyContent = { text, age, location, intervention };
    
        try {
            // Make the API request
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyContent),
            });
    
            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Parse the JSON response
            const data = await response.json();
    
            // Update state with the studies received
            setStudies(data.studies || []);
            setCurrentPage(1); // Reset to the first page
        } catch (error) {
            console.error('Error fetching studies:', error);
            setStudies([]); // Clear studies in case of an error
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    // Calculate the visible studies based on pagination
    const indexOfLastStudy = currentPage * studiesPerPage;
    const indexOfFirstStudy = indexOfLastStudy - studiesPerPage;
    const currentStudies = studies.slice(indexOfFirstStudy, indexOfLastStudy);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 3, backgroundColor: '#000000' }}>
                <Dialog open={openModal} onClose={handleCloseModal} sx={{ '& .MuiPaper-root': { backgroundColor: '#333', color: 'white' } }}>
                    <DialogTitle>{"How to Use This Page"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: 'white' }}>
                            Enter details about the disease or condition, patient age, preferred location, and intervention/treatment to find relevant studies. Click 'Search Study' to display results. Navigate using 'Previous' and 'Next' buttons.
                        </DialogContentText>
                    </DialogContent>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </Dialog>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    p: 3,
                    backgroundColor: '#1f1d1d',
                    boxShadow: '0px 3px 10px rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Generate Study Details
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/dashboard')}
                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        Dashboard
                    </Button>
                </Box>
                <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: '8px', backgroundColor: '#1f1d1d', color: 'white' }}>
                    <TextField
                        value={text}
                        onChange={handleTextChange}
                        label="Enter Disease or Condition"
                        fullWidth
                        multiline
                        color="warning" 
                        rows={2}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-input': {
                                color: 'white', // sets the text color inside the input
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white', // sets the label color
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white', // sets the border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white', // enhances the border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white', // sets the border color on focus to green or any color that fits your theme
                                },
                            }
                        }}
                    />

                    <TextField
                        value={age}
                        onChange={handleAgeChange}
                        label="Patient Age"
                        type="number"
                        fullWidth
                        color="warning" 
                        variant="outlined"
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white', // Border color on focus
                                },
                            }
                        }}
                    />
                    <TextField
                        value={location}
                        onChange={handleLocationChange}
                        label="Location Preference"
                        fullWidth
                        color="warning" 
                        variant="outlined"
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            }
                        }}
                    />
                    <TextField
                        value={intervention}
                        onChange={handleInterventionChange}
                        label="Intervention/Treatment"
                        fullWidth
                        variant="outlined"
                        color="warning" 
                        sx={{
                            mb: 3,
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                },
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5, backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
                    >
                        {loading ? <CircularProgress size={24} color="primary" /> : 'Search Study'}
                    </Button>
                </Paper>

                {currentStudies.length > 0 && (
                    <Grid container spacing={3}>
                        {currentStudies.map((study, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, borderRadius: '8px', backgroundColor: '#333', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="body1" style={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                                            {study}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 4,
                    pt: 2,
                    width: '100%',
                    borderTop: '1px solid #FFF'
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                        disabled={currentPage === 1}
                        sx={{ mr: 1, color: 'white', borderColor: 'white' }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                        disabled={currentPage * studiesPerPage >= studies.length}
                        sx={{ color: 'white', borderColor: 'white' }}
                    >
                        Next
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
