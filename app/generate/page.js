"use client";
import { Container, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogContentText,  TextField, Button, CircularProgress, Box, CssBaseline, List, ListItem, ListItemText, Switch, FormControlLabel } from '@mui/material';
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
            secondary: '#FFA500'
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
    const [selectedStudy, setSelectedStudy] = useState(null); // Track selected study
    const [showSimplified, setShowSimplified] = useState(true); // Track toggle status
    const [openModal, setOpenModal] = useState(true);
    const router = useRouter();

    const handleTextChange = (event) => setText(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value);
    const handleLocationChange = (event) => setLocation(event.target.value);
    const handleInterventionChange = (event) => setIntervention(event.target.value);

    // Extract and structure the data returned from the API
    const extractAndStructureData = (data) => {
        return data.studies.map(study => {
            const lines = study.split('\n');
            return {
                originalTitle: lines.find(line => line.startsWith('1. Original Title:')).split(': ')[1],
                simplifiedTitle: lines.find(line => line.startsWith('2. Simplified Title:')).split(': ')[1],
                originalDescription: lines.find(line => line.startsWith('3. Original Description:')).split(': ')[1],
                simplifiedDescription: lines.find(line => line.startsWith('4. Simplified Description:')).split(': ')[1],
                participants: lines.find(line => line.startsWith('5. Number of Participants:')).split(': ')[1],
                minimumAge: lines.find(line => line.startsWith('6. Minimum Age:')).split(': ')[1],
                leadSponsor: lines.find(line => line.startsWith('7. Lead Sponsor:')).split(': ')[1],
            };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const bodyContent = { text, age, location, intervention };

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyContent),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const structuredData = extractAndStructureData(data);
            setStudies(structuredData);
            setSelectedStudy(null); // Reset the selected study on new search
        } catch (error) {
            console.error('Error fetching studies:', error);
            setStudies([]);
        } finally {
            setLoading(false); 
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleStudyClick = (study) => {
        setSelectedStudy(study);
    };

    const handleToggleChange = () => {
        setShowSimplified(!showSimplified); // Toggle between simplified and original view
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 3, backgroundColor: '#000000' }}>

            <Dialog open={openModal} onClose={handleCloseModal} sx={{ '& .MuiPaper-root': { backgroundColor: '#333', color: 'white' } }}>
                    <DialogTitle>{"How to Use This Page"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: 'white' }}>
                            Enter details about the disease or condition, patient age, preferred location, and intervention/treatment to find relevant studies. Click 'Search Study' to display results. Navigate using the scroller on the side.
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
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
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

                {/* Search Form */}
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
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
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
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
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
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
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
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
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

                {/* Study List and Details - LinkedIn Style */}
                <Box sx={{ display: 'flex', flexDirection: 'row', height: '80vh' }}>
                    {/* Left Side - Study List */}
                    <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: '8px', backgroundColor: '#1f1d1d', color: 'white', overflowY: 'scroll' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>Clinical Trials List</Typography>
                        <List>
                            {studies.map((study, index) => (
                                <ListItem button key={index} onClick={() => handleStudyClick(study)} sx={{ borderBottom: '1px solid white', mb:2}}>
                                    <ListItemText
                                        primary={study.simplifiedTitle}
                                        secondary={`Participants: ${study.participants},  Min Age: ${study.minimumAge}`}
                                        sx={{ color: 'white' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {/* Right Side - Study Details */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            flex: 2, 
                            p: 3, 
                            ml: 3, 
                            borderRadius: '12px', 
                            background: 'linear-gradient(145deg, #222, #1b1b1b)', 
                            color: 'white', 
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)', 
                            overflowY: 'scroll', 
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                            '&:hover': { 
                                transform: 'scale(1.02)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={showSimplified} 
                                        onChange={handleToggleChange} 
                                        color="success"
                                    />
                                }
                                label={showSimplified ? "Show Original" : "Show Simplified"}
                                sx={{ color: '#FFFFFF' }}
                            />
                            <Button 
                                variant="contained" 
                                color="warning" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    backgroundColor: 'green',
                                    '&:hover': { backgroundColor: '#E68A00' }
                                }}
                                onClick={() => router.push('/apply')}
                            >
                                Apply
                            </Button>
                        </Box>

                        {selectedStudy ? (
                            <>
                                {showSimplified ? (
                                    <>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                mb: 2, 
                                                color: '#E0E0E0', 
                                                fontWeight: 'bold', 
                                                fontSize: '1.5rem' 
                                            }}
                                        >
                                            Simplified Title: {selectedStudy.simplifiedTitle}
                                        </Typography>

                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                mb: 2, 
                                                color: '#CFD8DC' 
                                            }}
                                        >
                                            <strong>Simplified Description:</strong> {selectedStudy.simplifiedDescription}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                mb: 2, 
                                                color: '#E0E0E0', 
                                                fontWeight: 'bold', 
                                                fontSize: '1.5rem' 
                                            }}
                                        >
                                            Original Title: {selectedStudy.originalTitle}
                                        </Typography>

                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                mb: 2, 
                                                color: '#CFD8DC' 
                                            }}
                                        >
                                            <strong>Original Description:</strong> {selectedStudy.originalDescription}
                                        </Typography>
                                    </>
                                )}

                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mb: 2, 
                                        color: '#90A4AE' 
                                    }}
                                >
                                    <strong>Minimum Age:</strong> {selectedStudy.minimumAge}
                                </Typography>
                                
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mb: 2, 
                                        color: '#90A4AE' 
                                    }}
                                >
                                    <strong>Participants:</strong> {selectedStudy.participants}
                                </Typography>

                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mb: 2, 
                                        color: '#90A4AE' 
                                    }}
                                >
                                    <strong>Lead Sponsor:</strong> {selectedStudy.leadSponsor}
                                </Typography>
                            </>
                        ) : (
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: 'white', 
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    textAlign: 'center', 
                                }}
                            >
                                Select a study to see more details.
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
