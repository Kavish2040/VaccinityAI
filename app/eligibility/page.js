"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Container, Typography, TextField, Button, Box, CircularProgress,
    AppBar, Toolbar, Modal, Fade, Backdrop, IconButton, LinearProgress,
    ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styles from './Eligibility.module.css';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#8B5CF6', // Purple from the image
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
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
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
    },
});

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
        console.log("Raw eligibilityCriteriaParam:", eligibilityCriteriaParam);

        if (eligibilityCriteriaParam) {
            try {
                const decodedParam = decodeURIComponent(eligibilityCriteriaParam);
                console.log("Decoded eligibilityCriteriaParam:", decodedParam);

                setEligibilityCriteria(decodedParam);
                fetchQuestions(decodedParam);
            } catch (error) {
                setEligibilityCriteria(eligibilityCriteriaParam);
                fetchQuestions(eligibilityCriteriaParam);
            }
        } else {
            console.log("No eligibilityCriteriaParam found in URL");
            router.push('/');
        }
    }, [searchParams, router]);

    const fetchQuestions = async (criteria) => {
        console.log("Criteria received in fetchQuestions:", criteria);
        setLoading(true);
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
            console.log("Response from /api/openai:", data);
           
            if (data.questions && Array.isArray(data.questions)) {
                setQuestions(data.questions.filter(q => q.text.trim()));
                setAnswers(new Array(data.questions.length).fill(''));
            } else {
                console.error("Unexpected response format from /api/openai");
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            setQuestions([]);
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
                console.log("Match result:", data);
                setModalOpen(true);
            } catch (error) {
                console.error('Error in submission:', error);
            }
        } else {
            console.log("No questions or answers available");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky" className={styles.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => router.back()} sx={{ mr: 2 }}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Clinical Trial Eligibility
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" className={styles.contentContainer}>
                <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
                    Eligibility Criteria Questions
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress color="primary" size={60} />
                    </Box>
                ) : (
                    <>
                        <Box className={styles.progressContainer}>
                            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                                {`${Math.round(progress)}% Complete`}
                            </Typography>
                        </Box>
                        
                        {questions.map((question, index) => (
                            <Box key={index} className={styles.questionCard}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                    Question {index + 1}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {question.text}
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={answers[index]}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    placeholder="Type your answer here"
                                    multiline
                                    rows={3}
                                />
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                onClick={handleSubmit}
                                disabled={progress !== 100}
                                size="large"
                                className={styles.submitButton}
                            >
                                Submit Answers
                            </Button>
                        </Box>
                    </>
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
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        p: 4,
                    }}>
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