"use client";

import {
    Container, Typography, Paper, Dialog, DialogTitle,
    DialogContent, DialogContentText, TextField, Button,
    CircularProgress, Box, CssBaseline, List, ListItem,
    ListItemText, Switch, FormControlLabel, Toolbar, AppBar
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from "next/image";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8B5CF6', // Purple color from the image
        },
        background: {
            default: '#000000',
            paper: '#1F2937', // Dark gray for paper components
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#9CA3AF', // Light gray for secondary text
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
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [showSimplified, setShowSimplified] = useState(true);
    const [openModal, setOpenModal] = useState(true);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const storedData = sessionStorage.getItem('searchData');
        if (storedData) {
            const { studies, text, age, location, intervention } = JSON.parse(storedData);
            setStudies(studies || []);
            setText(text || '');
            setAge(age || '');
            setLocation(location || '');
            setIntervention(intervention || '');
            
            // Set the first study as selected if available
            if (studies && studies.length > 0) {
                setSelectedStudy(studies[0]);
            }
        }
    }, []);

    const handleTextChange = (event) => setText(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value);
    const handleLocationChange = (event) => setLocation(event.target.value);
    const handleInterventionChange = (event) => setIntervention(event.target.value);

    const extractAndStructureData = (data) => {
        return data.studies.map(study => {
            const lines = study.split('\n');
            const getField = (keyword) => {
                const line = lines.find(line => line.includes(keyword));
                return line ? line.split('-> ')[1] : 'Not available';
            };
    
            return {
                originalTitle: getField('Original Title'),
                simplifiedTitle: getField('Simplified Title'),
                originalDescription: getField('Original Description'),
                simplifiedDescription: getField('Simplified Description'),
                participants: getField('Number of Participants'),
                minimumAge: getField('Minimum Age'),
                leadSponsor: getField('Lead Sponsor'),
                eligibilityCriteria: getField('Eligibility Criteria'),
                locations: getField('Location'),
            };
        });
    };

    const loadMoreStudies = async () => {
        setLoading(true);
        const bodyContent = { text, age, location, intervention, page: page + 1 };

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
            const newStudies = extractAndStructureData(data);
            
            if (newStudies.length === 0) {
                setHasMore(false);
            } else {
                setStudies([...studies, ...newStudies]);
                setPage(page + 1);
            }
        } catch (error) {
            console.error('Error fetching more studies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setPage(1);
        setHasMore(true);
        const bodyContent = { text, age, location, intervention, page: 1 };
     

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
            setSelectedStudy(null);

            sessionStorage.setItem('searchData', JSON.stringify({ studies: structuredData, text, age, location, intervention }));
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
        setShowSimplified(!showSimplified);
    };

    const handleCheckEligibility = () => {
        console.log("aaya"+ selectedStudy.eligibilityCriteria)
        if (selectedStudy && selectedStudy.eligibilityCriteria) {
            router.push(`/eligibility?eligibilityCriteria=${encodeURIComponent(JSON.stringify(selectedStudy.eligibilityCriteria))}`);
        } else {
            console.log("No study selected or eligibility criteria is missing");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
                position="sticky"
                sx={{
                    background: 'black',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
                    borderRadius: '1px',
                }}
                elevation={2}
            >
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', mb: -1.25, ml: 0, mt: -1 }}>
                        <Image src="/logo1.png" alt="Vaccinity AI Logo" width={205} height={100} />
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', mr: 0, mt: -1 }}>
                        <Button color="inherit" onClick={() => router.push('/')}>
                            HOME
                        </Button>
                        <Typography sx={{ mx: 2 }}>|</Typography>
                        <Button color="inherit" onClick={() => router.push('/dashboard')}>
                            DASHBOARD
                        </Button>
                        <Typography sx={{ mx: 2 }}>|</Typography>

                        <SignedOut>
                            <Button color="inherit" onClick={() => router.push('/sign-up')}>
                                SIGN UP
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 3, backgroundColor: '#000000' }}>
                <Dialog open={openModal} onClose={handleCloseModal} sx={{ '& .MuiPaper-root': { backgroundColor: '#333', color: 'white' } }}>
                    <DialogTitle>{"How to Use This Page"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: 'white' }}>
                            Enter details about the disease or condition, patient age, preferred location, and intervention/treatment to find relevant studies. Click 'Search Study' to display results. Navigate using the scroller on the side.
                        </DialogContentText>
                    </DialogContent>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                </Dialog>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    p: 3,
                    mt: 2,
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
                        sx={{ py: 1.5, backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Study'}
                    </Button>
                </Paper>

                {/* Study List and Details */}
                <Box sx={{ display: 'flex', flexDirection: 'row', height: '80vh' }}>
                    {/* Left Side - Study List */}
                    <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: '8px', backgroundColor: '#1F2937', color: 'white', overflowY: 'auto' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>Clinical Trials List</Typography>
                        {studies.length > 0 ? (
                            <>
                                <List>
                                    {studies.map((study, index) => (
                                        <ListItem button key={index} onClick={() => handleStudyClick(study)} sx={{ borderBottom: '1px solid #fff', mb: 2 }}>
                                            <ListItemText
                                                primary={study.simplifiedTitle}
                                                secondary={`Participants: ${study.participants}, Min Age: ${study.minimumAge}`}
                                                sx={{ 
                                                    '& .MuiListItemText-primary': { color: 'white' },
                                                    '& .MuiListItemText-secondary': { color: '#9CA3AF' }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                {hasMore && (
                                    <Button 
                                        onClick={loadMoreStudies} 
                                        fullWidth 
                                        variant="contained" 
                                        sx={{ mt: 2, backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
                                    >
                                        Load More
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Typography sx={{ color: 'white', textAlign: 'center' }}>No studies found.</Typography>
                        )}
                    </Paper>

                    {/* Right Side - Study Details */}
                    <Paper
                        elevation={3}
                        sx={{
                            flex: 2,
                            p: 3,
                            ml: 3,
                            borderRadius: '12px',
                            background: 'linear-gradient(145deg, #2D3748, #1A202C)',
                            color: 'white',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                            overflowY: 'auto',
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
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#8B5CF6',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#8B5CF6',
                                            },
                                        }}
                                    />
                                }
                                label={showSimplified ? "Show Original" : "Show Simplified"}
                                sx={{ color: '#FFFFFF' }}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    backgroundColor: '#8B5CF6',
                                    '&:hover': { backgroundColor: '#7C3AED' }
                                }}
                                onClick={handleCheckEligibility}
                            >
                                Check Eligibility
                            </Button>
                        </Box>

                        {selectedStudy ? (
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
                                    {showSimplified ? 'Simplified Title: ' : 'Original Title: '}
                                    {showSimplified ? selectedStudy.simplifiedTitle : selectedStudy.originalTitle}
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 2,
                                        color: '#CFD8DC'
                                    }}
                                >
                                    <strong>{showSimplified ? 'Simplified Description:' : 'Original Description:'}</strong> 
                                    {showSimplified ? selectedStudy.simplifiedDescription : selectedStudy.originalDescription}
                                </Typography>

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

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 2,
                                        color: '#90A4AE'
                                    }}
                                >
                                    <strong>Location:</strong> {selectedStudy.locations}
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