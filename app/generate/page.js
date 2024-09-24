"use client";
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogContentText,
    TextField, Button, CircularProgress, Box, CssBaseline, Switch, FormControlLabel,
    Toolbar, AppBar, Stepper, Step, StepLabel, Card, CardContent, Chip, Fade,
    IconButton, Drawer, Slider, Checkbox, Radio, RadioGroup, FormControl, FormLabel,
    Select, MenuItem, Grid, CardHeader
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Person, LocationOn, Science, Group, Business, FilterList, Lightbulb } from '@mui/icons-material';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import FloatingChatbot from '@/app/chatbot/FloatingChatbot';

// Define a modern and clean theme
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#6C63FF' },
        secondary: { main: '#FF6584' },
        background: { default: '#121212', paper: '#1E1E1E' },
        text: { primary: '#E0E0E0', secondary: '#A0A0A0' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: { fontSize: '1.75rem', fontWeight: 700 },
        h5: { fontSize: '1.25rem', fontWeight: 600 },
        body1: { fontSize: '0.95rem' },
        body2: { fontSize: '0.8rem' },
        button: { textTransform: 'none', fontSize: '0.9rem' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        backgroundColor: alpha('#6C63FF', 0.8),
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#1E1E1E', 0.95),
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
        MuiStepper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                },
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    fontSize: '0.8rem',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha('#1E1E1E', 0.95),
                },
            },
        },
    },
});

// Define interesting facts with icons
const interestingFacts = [
    {
        icon: <Lightbulb />,
        text: "Did you know? Clinical trials have led to many life-saving treatments.",
    },
    {
        icon: <Lightbulb />,
        text: "Fun Fact: Over 300,000 clinical trials are conducted worldwide each year.",
    },
    {
        icon: <Lightbulb />,
        text: "Interesting: Placebos play a crucial role in ensuring unbiased results.",
    },
    {
        icon: <Lightbulb />,
        text: "Did you know? The first clinical trial is believed to have been conducted in the 18th century.",
    },
    {
        icon: <Lightbulb />,
        text: "Fun Fact: Clinical trials are essential for advancing medical knowledge and patient care.",
    },
    {
        icon: <Lightbulb />,
        text: "Interesting: There are four phases in clinical trials, each serving a unique purpose.",
    },
    {
        icon: <Lightbulb />,
        text: "Did you know? Participation in clinical trials can provide access to new treatments.",
    },
    {
        icon: <Lightbulb />,
        text: "Fun Fact: Clinical trials help determine the safety and efficacy of new drugs.",
    },
    {
        icon: <Lightbulb />,
        text: "Interesting: Randomized controlled trials are considered the gold standard in research.",
    },
    {
        icon: <Lightbulb />,
        text: "Did you know? Volunteers in clinical trials help pave the way for future medical breakthroughs.",
    },
    // Add more facts as needed
];

// LoadingWithFacts Component with enhanced design
const LoadingWithFacts = () => {
    const [currentFactIndex, setCurrentFactIndex] = useState(0);

    useEffect(() => {
        const factInterval = setInterval(() => {
            setCurrentFactIndex(prevIndex => (prevIndex + 1) % interestingFacts.length);
        }, 5000); // Change fact every 5 seconds

        return () => clearInterval(factInterval);
    }, []);

    return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
            <CircularProgress color="primary" />
            <Box sx={{ mt: 2, minHeight: '80px' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentFactIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                p: 2, 
                                bgcolor: alpha('#6C63FF', 0.1), 
                                borderRadius: 2 
                            }}
                        >
                            <Box sx={{ mr: 2 }}>
                                {interestingFacts[currentFactIndex].icon}
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                {interestingFacts[currentFactIndex].text}
                            </Typography>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

const steps = ['Disease/Condition', 'Age', 'Location', 'Intervention'];

export default function Generate() {
    const { user } = useUser();
    const router = useRouter();
    const [studies, setStudies] = useState([]);
    const [text, setText] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [intervention, setIntervention] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [showSimplified, setShowSimplified] = useState(true);
    const [openModal, setOpenModal] = useState(true);
    const [nextPageToken, setNextPageToken] = useState('1'); // Initialize to '1'
    const [hasMore, setHasMore] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [openFilters, setOpenFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        phase: [],
        gender: 'all', // Changed from 'sex' to 'gender'
        ageRange: [0, 100],
        healthyVolunteers: false,
    });

    useEffect(() => {
        // Load any saved data from sessionStorage
        const storedData = sessionStorage.getItem('searchData');
        if (storedData) {
            const { studies, text, age, location, intervention, nextPageToken } = JSON.parse(storedData);
            setStudies(studies || []);
            setText(text || '');
            setAge(age || '');
            setLocation(location || '');
            setIntervention(intervention || '');
            setNextPageToken(nextPageToken || '1'); // Initialize to '1'

            if (studies && studies.length > 0) {
                setSelectedStudy(studies[0]);
            }
        }
    }, []);

    const handleToggleChange = () => {
        setShowSimplified(prevState => !prevState);
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleInterventionChange = (event) => {
        setIntervention(event.target.value);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setNextPageToken('1'); // Reset to first page on new search
        setHasMore(true);
        setStudies([]);  // Clear old studies
        setSelectedStudy(null);  // Clear selected study

        const bodyContent = { 
            text, 
            age, 
            location, 
            intervention, 
            pageToken: '1', // Start from first page
            seenIds: [],  // Reset seen IDs for a new search
            filters, // Include filters in the request
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

            if (data.error) {
                throw new Error(data.detail || 'Unknown error occurred');
            }

            const structuredData = extractAndStructureData(data.studies);

            // Reset scroll position when new studies are loaded
            const studyContainer = document.getElementById('study-list');
            if (studyContainer) {
                studyContainer.scrollTop = 0; // Reset scroll to top
            }

            setStudies(structuredData);
            setNextPageToken(data.nextPageToken);
            setHasMore(data.hasMore);

            sessionStorage.setItem('searchData', JSON.stringify({ 
                studies: structuredData, 
                text, 
                age, 
                location, 
                intervention,
                nextPageToken: data.nextPageToken
            }));
        } catch (error) {
            console.error('Error fetching studies:', error);
            setStudies([]);
            setNextPageToken('1');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreStudies = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    age,
                    location,
                    intervention,
                    pageToken: nextPageToken, // Use nextPageToken
                    seenIds: studies.map(study => study.ID),
                    filters, // Include filters in the request
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error, data.detail);
                return;
            }

            const structuredData = extractAndStructureData(data.studies);

            setStudies(prevStudies => [...prevStudies, ...structuredData]);
            setNextPageToken(data.nextPageToken);
            setHasMore(data.hasMore);

            sessionStorage.setItem('searchData', JSON.stringify({ 
                studies: [...studies, ...structuredData], 
                text, 
                age, 
                location, 
                intervention,
                nextPageToken: data.nextPageToken
            }));
        } catch (error) {
            console.error('Error loading more studies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleStudyClick = (study) => setSelectedStudy(study);

    const handleCheckEligibility = () => {
        if (selectedStudy && selectedStudy.eligibilityCriteria) {
            router.push(`/eligibility?eligibilityCriteria=${encodeURIComponent(JSON.stringify(selectedStudy.eligibilityCriteria))}`);
        } else {
            console.log("No study selected or eligibility criteria is missing");
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

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

    const getStepContent = (step) => {
        const textFieldStyle = {
            '& .MuiInputBase-input': { color: 'white', fontSize: '0.9rem' },
            '& .MuiInputLabel-root': { color: 'white', fontSize: '0.9rem' },
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
                        InputProps={{ inputProps: { min: 0 } }}
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

    const FilterSection = () => (
        <Drawer
            anchor="left"
            open={openFilters}
            onClose={() => setOpenFilters(false)}
            PaperProps={{
                sx: {
                    width: 280,
                    backgroundColor: theme.palette.background.paper,
                    p: 3,
                }
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Refine Your Search</Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.9rem' }}>Study Status</FormLabel>
                <RadioGroup
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                    <FormControlLabel value="all" control={<Radio />} label="All" />
                    <FormControlLabel value="recruiting" control={<Radio />} label="Recruiting" />
                    <FormControlLabel value="active" control={<Radio />} label="Active, not recruiting" />
                    <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                </RadioGroup>
            </FormControl>

            <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.9rem' }}>Study Phase</FormLabel>
                {['Early Phase 1', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase) => (
                    <FormControlLabel
                        key={phase}
                        control={
                            <Checkbox
                                checked={filters.phase.includes(phase)}
                                onChange={(e) => {
                                    const newPhases = e.target.checked
                                        ? [...filters.phase, phase]
                                        : filters.phase.filter(p => p !== phase);
                                    handleFilterChange('phase', newPhases);
                                }}
                            />
                        }
                        label={phase}
                        sx={{ fontSize: '0.8rem' }}
                    />
                ))}
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={{ mb: 1, fontSize: '0.9rem' }}>Gender</FormLabel> {/* Changed from 'Sex' to 'Gender' */}
                <Select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    size="small"
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
                <FormLabel sx={{ mb: 1, fontSize: '0.9rem' }}>Age Range</FormLabel>
                <Slider
                    value={filters.ageRange}
                    onChange={(e, newValue) => handleFilterChange('ageRange', newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                />
            </Box>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={filters.healthyVolunteers}
                        onChange={(e) => handleFilterChange('healthyVolunteers', e.target.checked)}
                    />
                }
                label="Accepts healthy volunteers"
                sx={{ mb: 3, fontSize: '0.8rem' }}
            />

            <Button
                variant="contained"
                fullWidth
                onClick={() => {
                    // Apply filters logic here
                    setOpenFilters(false);
                    handleSubmit(); // Optionally trigger a new search with applied filters
                }}
                sx={{ mt: 1 }}
            >
                Apply Filters
            </Button>
        </Drawer>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Redesigned AppBar */}
            <AppBar position="relative">
                <Toolbar sx={{ justifyContent: 'space-between', height: 60, mt:1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image src="/logo1.png" alt="Vaccinity AI Logo" width={215} height={110} priority />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Button color="inherit" onClick={() => router.push('/')}>Home</Button>
                        <Button color="inherit" onClick={() => router.push('/dashboard')}>Dashboard</Button>
                        <SignedOut>
                            <Button color="secondary" variant="contained" onClick={() => router.push('/sign-up')}>
                                Sign Up
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.95) }}>
                        <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                            Find Your Clinical Trial
                        </Typography>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
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
                        <Box sx={{ mt: 2, mb: 2 }}>
                            {getStepContent(activeStep)}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                                size="medium"
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                size="medium"
                            >
                                {activeStep === steps.length - 1 ? 'Search Studies' : 'Next'}
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>

                <Grid container spacing={3}>
                    {/* Filters Section */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.95) }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Filters</Typography>
                                <IconButton onClick={() => setOpenFilters(true)}>
                                    <FilterList />
                                </IconButton>
                            </Box>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setOpenFilters(true)}
                                startIcon={<FilterList />}
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Modify Filters
                            </Button>
                        </Paper>
                    </Grid>
                    
                    {/* Clinical Trials List */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.95), mb: 3, maxHeight: '600px', overflowY: 'auto' }} id="study-list">
                            <Typography variant="h5" sx={{ mb: 2, fontSize: '1.1rem' }}>Clinical Trials</Typography>
                            {loading && studies.length === 0 ? (
                                <LoadingWithFacts />
                            ) : studies.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    {studies.map((study, index) => (
                                        <motion.div
                                            key={study.ID}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <Card 
                                                sx={{ 
                                                    mb: 2, 
                                                    bgcolor: selectedStudy?.ID === study.ID ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleStudyClick(study)}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '0.95rem' }}>
                                                        {study.simplifiedTitle}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip 
                                                            icon={<Group />} 
                                                            label={`Participants: ${study.participants}`}
                                                            size="small"
                                                            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), fontSize: '0.75rem' }}
                                                        />
                                                        <Chip 
                                                            icon={<Person />} 
                                                            label={`Min Age: ${study.minimumAge}`}
                                                            size="small"
                                                            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), fontSize: '0.75rem' }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>No studies found.</Typography>
                            )}
                            {loading && studies.length > 0 && (
                                <LoadingWithFacts />
                            )}
                            {hasMore && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button 
                                        onClick={loadMoreStudies} 
                                        variant="outlined" 
                                        size="small"
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={20} /> : 'Load More'}
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                    
                    {/* Study Details */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.background.paper, 0.95), height: { md: '600px' }, overflowY: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showSimplified}
                                            onChange={handleToggleChange}
                                            color="primary"
                                        />
                                    }
                                    label={showSimplified ? "Simplified View" : "Original View"}
                                    sx={{ fontSize: '0.8rem' }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleCheckEligibility}
                                    size="small"
                                >
                                    Check Eligibility
                                </Button>
                            </Box>

                            {selectedStudy ? (
                                <Fade in={true}>
                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1rem' }}>
                                            {showSimplified ? selectedStudy.simplifiedTitle : selectedStudy.originalTitle}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2, fontSize: '0.85rem' }}>
                                            {showSimplified ? selectedStudy.simplifiedDescription : selectedStudy.originalDescription}
                                        </Typography>
                                    
                                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
                                            <strong>Location:</strong> {selectedStudy.locations}
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                            <Chip icon={<Person />} label={`Min Age: ${selectedStudy.minimumAge}`} size="small" />
                                            <Chip icon={<Group />} label={`Participants: ${selectedStudy.participants}`} size="small" />
                                            <Chip icon={<Business />} label={`Lead Sponsor: ${selectedStudy.leadSponsor}`} size="small" />
                                        </Box>
                                    </Box>
                                </Fade>
                            ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.85rem' }}>
                                    Select a study to see more details.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                <FilterSection />

                {/* Instruction Modal */}
                <Dialog 
                    open={openModal} 
                    onClose={handleCloseModal}
                    PaperProps={{
                        sx: {
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 2,
                            maxWidth: 'xs',
                            width: '90%',
                            p: 3,
                        }
                    }}
                >
                    <DialogTitle sx={{ fontSize: '1.2rem' }}>How to Use This Page</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ fontSize: '0.85rem' }}>
                            Enter details about the disease or condition, patient age, preferred location, and intervention/treatment to find relevant studies. Use the filters to refine your search. Click on a study to view more details.
                        </DialogContentText>
                    </DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleCloseModal} color="primary" variant="contained" size="small">
                            Got it
                        </Button>
                    </Box>
                </Dialog>
            </Container>
            <FloatingChatbot />
        </ThemeProvider>
    );
}
