"use client";

import {
    Container, Typography, Paper, TextField,
    CssBaseline, Button, Box, CircularProgress,
    AppBar, Toolbar, Modal, Fade, Backdrop, IconButton,
    Card, CardContent, LinearProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4CAF50',
        },
        secondary: {
            main: '#FF4081',
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.4)',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
    },
});

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    p: 4,
};

export default function Eligibility() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [eligibilityCriteria, setEligibilityCriteria] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const eligibilityCriteriaParam = searchParams.get('eligibilityCriteria');

        if (eligibilityCriteriaParam) {
            try {
                const parsedCriteria = JSON.parse(decodeURIComponent(eligibilityCriteriaParam));
                setEligibilityCriteria(parsedCriteria);
                fetchQuestions(parsedCriteria);
            } catch (error) {
                console.error('Error parsing eligibility criteria:', error);
            }
        } else {
            router.push('/');
        }
    }, [searchParams, router]);

    const fetchQuestions = async (criteria) => {
        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ criteria }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching questions: ${response.statusText}`);
            }

            const data = await response.json();
           
            setQuestions(data.questions.filter(q => q.text.trim()));
            setAnswers(new Array(data.questions.length).fill(''));
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (index, answer) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = answer;
        setAnswers(updatedAnswers);
        setProgress((updatedAnswers.filter(a => a !== '').length / questions.length) * 100);
    };

    const handleSubmit = async () => {
        if (questions.length > 0 && answers.length > 0) {
            try {
                const response = await fetch('/api/match', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ questions, answers, eligibilityCriteria }),
                });

                if (!response.ok) {
                    throw new Error(`Error fetching response: ${response.statusText}`);
                }

                const data = await response.json();
                setMatchResult(data);
                console.log(data)
                setModalOpen(true);
            } catch (error) {
                console.error('Error in submission:', error);
            }
        } else {
            console.log("No study selected or eligibility criteria is missing");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => router.back()} sx={{ mr: 2 }}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Clinical Trial Eligibility
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 5 }}>
                <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                    Eligibility Criteria Questions
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Card elevation={3}>
                        <CardContent>
                            <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
                            {questions.length > 0 ? (
                                questions.map((question, index) => (
                                    <Box key={index} sx={{ mb: 3 }}>
                                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                            {question.text}
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            value={answers[index]}
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            placeholder="Type your response here"
                                            sx={{ bgcolor: 'background.paper' }}
                                        />
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                    No given criteria for this study.
                                </Typography>
                            )}

                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    sx={{ px: 5, py: 2 }}
                                    disabled={progress !== 100}
                                >
                                    Submit Answers
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Container>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={modalStyle}>
                        <IconButton
                            aria-label="close"
                            onClick={() => setModalOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {matchResult?.match ? (
                                <>
                                    <CheckCircleOutlineIcon color="success" />
                                    Match Found
                                </>
                            ) : (
                                <>
                                    <CancelOutlinedIcon color="error" />
                                    No Match
                                </>
                            )}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {matchResult?.explanation}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </ThemeProvider>
    );
}
