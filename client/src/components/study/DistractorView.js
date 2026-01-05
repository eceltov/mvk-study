import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Paper, Button } from '@mui/material';

const DistractorView = ({ mathProblem, duration, onComplete }) => {
    const [answer, setAnswer] = useState('');
    const onCompleteRef = useRef(onComplete);
    const answerRef = useRef(answer);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        answerRef.current = answer;
    }, [answer]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onCompleteRef.current) {
                onCompleteRef.current(answerRef.current);
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleSubmit = () => {
        if (onComplete) {
            onComplete(answer);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: 'white',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" gutterBottom>
          Solve the problem:
                </Typography>
                <Typography variant="h3" gutterBottom>
                    {mathProblem || "14 + 8"}
                </Typography>
                <TextField
                    label="Answer"
                    variant="outlined"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                    autoFocus
                />
                <Button variant="contained" onClick={handleSubmit}>
          Submit
                </Button>
                <Typography variant="caption" color="textSecondary">
          Please solve this while you wait.
                </Typography>
            </Paper>
        </Box>
    );
};

export default DistractorView;
