"use client";
import { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Grid, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation'; 

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

export default function PatientData() {
    const [patientDetails, setPatientDetails] = useState([]);
    const [name, setName] = useState('');
    const [healthCondition, setHealthCondition] = useState('');
    const [pastSurgeries, setPastSurgeries] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const router = useRouter(); // Initialize the router

    const handleSubmit = (event) => {
        event.preventDefault();
        const newDetail = { name, healthCondition, pastSurgeries, diagnosis };
        setPatientDetails([...patientDetails, newDetail]);

      
        setName('');
        setHealthCondition('');
        setPastSurgeries('');
        setDiagnosis('');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: 3, color: 'white', backgroundColor: '#000000', minHeight: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Patient Data Tracker
                    </Typography>
                    <Button variant="contained" onClick={() => router.push('/dashboard')} sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
                        Go to Dashboard
                    </Button>
                </Box>
                <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: '8px', backgroundColor: '#1f1d1d' }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    label="Patient Name"
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
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={healthCondition}
                                    onChange={(e) => setHealthCondition(e.target.value)}
                                    label="Health Condition"
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
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={pastSurgeries}
                                    onChange={(e) => setPastSurgeries(e.target.value)}
                                    label="Past Surgeries"
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
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    label="Diagnosis"
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
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
                <Box>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Patient Details:
                    </Typography>
                    {patientDetails.length > 0 ? (
                        patientDetails.map((detail, index) => (
                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, borderRadius: '8px', backgroundColor: '#333' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{`Name: ${detail.name}`}</Typography>
                                <Typography variant="body1">{`Health Condition: ${detail.healthCondition}`}</Typography>
                                <Typography variant="body1">{`Past Surgeries: ${detail.pastSurgeries}`}</Typography>
                                <Typography variant="body1">{`Diagnosis: ${detail.diagnosis}`}</Typography>
                            </Paper>
                        ))
                    ) : (
                        <Typography variant="body1">No patient details available.</Typography>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}
