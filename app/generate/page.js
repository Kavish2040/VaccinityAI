"use client";

import {
    Container, Typography, Paper, Dialog, DialogTitle,
    DialogContent, DialogContentText, TextField, Button,
    CircularProgress, Box, CssBaseline, List, ListItem,
    ListItemText, Switch, FormControlLabel, Toolbar, AppBar,
    Stepper, Step, StepLabel, Card, CardContent, Chip, Fade,
    IconButton, Tooltip
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Person, LocationOn, Science, Group, Business, ExpandMore, ExpandLess } from '@mui/icons-material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#8B5CF6' },
        background: { default: '#000000', paper: '#1F2937' },
        text: { primary: '#FFFFFF', secondary: '#9CA3AF' },
    },
});

const steps = ['Disease/Condition', 'Age', 'Location', 'Intervention'];

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
    const [nextPageToken, setNextPageToken] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const storedData = sessionStorage.getItem('searchData');
        if (storedData) {
            const { studies, text, age, location, intervention, nextPageToken } = JSON.parse(storedData);
            setStudies(studies || []);
            setText(text || '');
            setAge(age || '');
            setLocation(location || '');
            setIntervention(intervention || '');
            setNextPageToken(nextPageToken || '');
            
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
        return data.map(study => {
            const lines = study.split('\n');
            const getField = (keyword) => {
                const line = lines.find(line => line.includes(keyword));
                return line ? line.split('-> ')[1] : 'Not available';
            };
    
            return {
                ID: (getField('ID')).trim(),
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
        const bodyContent = { 
            text, age, location, intervention, pageToken: nextPageToken
        };

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
            if (data.studies && data.studies.length > 0) {
                const newStudies = extractAndStructureData(data.studies);
                setStudies(prevStudies => [...prevStudies, ...newStudies]);
                setNextPageToken(data.nextPageToken);
                setHasMore(data.hasMore);

                const currentData = JSON.parse(sessionStorage.getItem('searchData') || '{}');
                sessionStorage.setItem('searchData', JSON.stringify({
                    ...currentData,
                    studies: [...(currentData.studies || []), ...newStudies],
                    nextPageToken: data.nextPageToken
                }));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching more studies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setNextPageToken('');
        setHasMore(true);
        const bodyContent = { text, age, location, intervention, pageToken: '' };
     
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
            const structuredData = extractAndStructureData(data.studies);
            setStudies(structuredData);
            setSelectedStudy(null);
            setNextPageToken(data.nextPageToken);
            setHasMore(data.hasMore);

            sessionStorage.setItem('searchData', JSON.stringify({ 
                studies: structuredData, 
                text, age, location, intervention,
                nextPageToken: data.nextPageToken
            }));
        } catch (error) {
            console.error('Error fetching studies:', error);
            setStudies([]);
            setNextPageToken('');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => setOpenModal(false);
    const handleStudyClick = (study) => setSelectedStudy(study);
    const handleToggleChange = () => setShowSimplified(!showSimplified);
    const handleCheckEligibility = () => {
        if (selectedStudy && selectedStudy.eligibilityCriteria) {
            router.push(`/eligibility?eligibilityCriteria=${encodeURIComponent(JSON.stringify(selectedStudy.eligibilityCriteria))}`);
        } else {
            console.log("No study selected or eligibility criteria is missing");
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getStepContent = (step) => {
        const textFieldStyle = {
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
            }
        };

        switch (step) {
            case 0:
                return (
                    <TextField
                        value={text}
                        onChange={handleTextChange}
                        label="Enter Disease or Condition"
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={textFieldStyle}
                    />
                );
            case 1:
                return (
                    <TextField
                        value={age}
                        onChange={handleAgeChange}
                        label="Patient Age"
                        type="number"
                        fullWidth
                        variant="outlined"
                        sx={textFieldStyle}
                    />
                );
            case 2:
                return (
                    <TextField
                        value={location}
                        onChange={handleLocationChange}
                        label="Location Preference"
                        fullWidth
                        variant="outlined"
                        sx={textFieldStyle}
                    />
                );
            case 3:
                return (
                    <TextField
                        value={intervention}
                        onChange={handleInterventionChange}
                        label="Intervention/Treatment"
                        fullWidth
                        variant="outlined"
                        sx={textFieldStyle}
                    />
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky" sx={{ background: 'black', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', mb: -1.25, ml: 0, mt: -1 }}>
                        <Image src="/logo1.png" alt="Vaccinity AI Logo" width={205} height={100} />
                    </Box>
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', mr: 0, mt: -1 }}>
                        <Button color="inherit" onClick={() => router.push('/')}>HOME</Button>
                        <Typography sx={{ mx: 2 }}>|</Typography>
                        <Button color="inherit" onClick={() => router.push('/dashboard')}>DASHBOARD</Button>
                        <Typography sx={{ mx: 2 }}>|</Typography>
                        <SignedOut>
                            <Button color="inherit" onClick={() => router.push('/sign-up')}>SIGN UP</Button>
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: '16px', backgroundColor: '#1f1d1d' }}>
                        <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                            Find Your Clinical Trial
                        </Typography>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={({active, completed}) => (
                                        <motion.div
                                            initial={false}
                                            animate={{ scale: active || completed ? 1.2 : 1 }}
                                        >
                                            {index === 0 && <Search color={active || completed ? "primary" : "disabled"} />}
                                            {index === 1 && <Person color={active || completed ? "primary" : "disabled"} />}
                                            {index === 2 && <LocationOn color={active || completed ? "primary" : "disabled"} />}
                                            {index === 3 && <Science color={active || completed ? "primary" : "disabled"} />}
                                        </motion.div>
                                    )}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Box sx={{ mt: 4, mb: 2 }}>
                            {getStepContent(activeStep)}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                                sx={{ color: 'white', borderColor: 'white' }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
                            >
                                {activeStep === steps.length - 1 ? 'Search Studies' : 'Next'}
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>

                {/* Study List and Details */}
                <Box sx={{ display: 'flex', flexDirection: 'row', height: '60vh' }}>
                    {/* Left Side - Study List */}
                    <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: '16px', backgroundColor: '#1F2937', overflowY: 'auto' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>Clinical Trials</Typography>
                        {studies.length > 0 ? (
                            <AnimatePresence>
                                {studies.map((study, index) => (
                                    <motion.div
                                        key={study.ID}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                    <Card 
                                                sx={{ 
                                                    mb: 2, 
                                                    backgroundColor: selectedStudy?.ID === study.ID ? 'rgba(139, 92, 246, 0.2)' : '#2D3748',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                                    }
                                                }}
                                                onClick={() => handleStudyClick(study)}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                                                        {study.simplifiedTitle}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip 
                                                            icon={<Group sx={{ color: 'white' }} />} 
                                                            label={`Participants: ${study.participants}`}
                                                            sx={{ backgroundColor: '#4A5568', color: 'white' }}
                                                        />
                                                        <Chip 
                                                            icon={<Person sx={{ color: 'white' }} />} 
                                                            label={`Min Age: ${study.minimumAge}`}
                                                            sx={{ backgroundColor: '#4A5568', color: 'white' }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <Typography sx={{ color: 'white', textAlign: 'center' }}>No studies found.</Typography>
                            )}
                            {hasMore && (
                                <Button 
                                    onClick={loadMoreStudies} 
                                    fullWidth 
                                    variant="contained" 
                                    sx={{ mt: 2, backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Load More'}
                                </Button>
                            )}
                        </Paper>
        
                        {/* Right Side - Study Details */}
                        <Paper
                            elevation={3}
                            sx={{
                                flex: 2,
                                p: 3,
                                ml: 3,
                                borderRadius: '16px',
                                background: 'linear-gradient(145deg, #2D3748, #1A202C)',
                                color: 'white',
                                overflowY: 'auto',
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
                                <Fade in={true}>
                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#E0E0E0', fontWeight: 'bold' }}>
                                            {showSimplified ? selectedStudy.simplifiedTitle : selectedStudy.originalTitle}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2, color: '#CFD8DC' }}>
                                            {showSimplified ? selectedStudy.simplifiedDescription : selectedStudy.originalDescription}
                                        </Typography>
                                     
                                        <Typography variant="body1" sx={{ mb: 2, color: '#90A4AE' }}>
                                            <strong>Location:</strong> {selectedStudy.locations}
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                            <Chip icon={<Person />} label={`Min Age: ${selectedStudy.minimumAge}`} />
                                            <Chip icon={<Group />} label={`Participants: ${selectedStudy.participants}`} />
                                            <Chip icon={<Business />} label={`Lead Sponsor: ${selectedStudy.leadSponsor}`} />
                                        </Box>
                                    </Box>
                                </Fade>
                            ) : (
                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
                                    Select a study to see more details.
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }