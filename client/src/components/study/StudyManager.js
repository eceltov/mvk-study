import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Paper, CircularProgress, Alert } from '@mui/material';
import LandingPage from './LandingPage';
import ImageView from './ImageView';
import DistractorView from './DistractorView';
import DrawingView from './DrawingView';
import AdjustmentView from './AdjustmentView';
import { studyConfig } from '../../studyConfig';

const PHASES = {
    LANDING: 'LANDING',
    IMAGE: 'IMAGE',
    DISTRACTOR: 'DISTRACTOR',
    DRAWING: 'DRAWING',
    ADJUSTMENT: 'ADJUSTMENT',
    COMPLETED: 'COMPLETED'
};

const StudyManager = ({ prolificId }) => {
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [phase, setPhase] = useState(PHASES.LANDING);
    const [allRoundsData, setAllRoundsData] = useState([]);
    const [phaseStartTime, setPhaseStartTime] = useState(null);
    const [studyStartTime, setStudyStartTime] = useState(null);
    const [instructionTimings, setInstructionTimings] = useState([]);

    // New state for dynamic round config
    const [currentRoundConfig, setCurrentRoundConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Store data that needs to persist across renders but doesn't trigger re-renders
    const currentRoundDataRef = useRef({});

    useEffect(() => {
        setPhaseStartTime(Date.now());
        if (phase === PHASES.IMAGE) {
            currentRoundDataRef.current.roundStart = new Date().toISOString();
        }
    }, [phase]);

    const getDuration = () => {
        if (!phaseStartTime) {
            return 0;
        }
        return Date.now() - phaseStartTime;
    };

    const fetchNextRound = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/random-round');
            if (!response.ok) {
                throw new Error('Failed to fetch round data');
            }
            const data = await response.json();

            setCurrentRoundConfig({
                id: data.imageId,
                imageSrc: data.imageSrc,
                mathProblem: data.mathProblem,
                imageDuration: studyConfig.imageDuration,
                distractorDuration: studyConfig.distractorDuration
            });
            setLoading(false);
            return true;
        }
        catch (err) {
            console.error(err);
            setError('Error loading study data. Please refresh.');
            setLoading(false);
            return false;
        }
    };

    const handleStart = async (timings) => {
        setInstructionTimings(timings);
        const success = await fetchNextRound();
        if (success) {
            setStudyStartTime(new Date().toISOString());
            setPhase(PHASES.IMAGE);
        }
    };

    const handleImageComplete = () => {
        const duration = getDuration();
        currentRoundDataRef.current.imageDuration = duration;
        setPhase(PHASES.DISTRACTOR);
    };

    const handleDistractorComplete = (answer) => {
        const duration = getDuration();
        currentRoundDataRef.current.distractorDuration = duration;
        currentRoundDataRef.current.distractorAnswer = answer;
        setPhase(PHASES.DRAWING);
    };

    const handleDrawingComplete = async (data) => {
        const duration = getDuration();
        currentRoundDataRef.current.drawingDuration = duration;
        currentRoundDataRef.current.initialRect = data.rect;
        currentRoundDataRef.current.globalDesc = data.globalDesc;
        currentRoundDataRef.current.objectDesc = data.objectDesc;

        // Store complete round data
        const completedRound = {
            config: currentRoundConfig,
            data: { ...currentRoundDataRef.current }
        };

        console.log('Completing round:', completedRound);

        setAllRoundsData(prev => [...prev, completedRound]);

        // Check if we have more rounds to do
        if (currentRoundIndex < studyConfig.numberOfRounds - 1) {
            setCurrentRoundIndex(prev => prev + 1);
            currentRoundDataRef.current = {}; // Reset for next round

            const success = await fetchNextRound();
            if (success) {
                setPhase(PHASES.IMAGE);
            }
        }
        else {
            // All rounds done, start adjustment phase
            setCurrentRoundIndex(0);
            setPhase(PHASES.ADJUSTMENT);
        }
    };

    const handleAdjustmentComplete = async (finalRect) => {
        const duration = getDuration();

        // Update the specific round in allRoundsData
        const updatedRoundsData = [...allRoundsData];
        updatedRoundsData[currentRoundIndex] = {
            ...updatedRoundsData[currentRoundIndex],
            data: {
                ...updatedRoundsData[currentRoundIndex].data,
                adjustmentDuration: duration,
                finalRect: finalRect
            }
        };
        setAllRoundsData(updatedRoundsData);

        // Move to next adjustment or finish
        if (currentRoundIndex < allRoundsData.length - 1) {
            setCurrentRoundIndex(prev => prev + 1);
        }
        else {
            // Submit all data
            const payload = {
                prolificId,
                studyStart: studyStartTime,
                instructionTimings,
                rounds: updatedRoundsData.map(r => ({
                    roundId: r.config.id,
                    roundStart: r.data.roundStart,
                    imageDuration: r.data.imageDuration,
                    distractorDuration: r.data.distractorDuration,
                    distractorProblem: r.config.mathProblem,
                    distractorAnswer: r.data.distractorAnswer,
                    drawingDuration: r.data.drawingDuration,
                    initialRect: r.data.initialRect,
                    globalDesc: r.data.globalDesc,
                    objectDesc: r.data.objectDesc,
                    adjustmentDuration: r.data.adjustmentDuration,
                    finalRect: r.data.finalRect
                }))
            };

            try {
                await fetch('/api/study-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                console.log('Study data sent successfully');
            }
            catch (error) {
                console.error('Error sending study data:', error);
            }

            setPhase(PHASES.COMPLETED);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Box>
            {phase === PHASES.LANDING && <LandingPage onStart={handleStart} />}

            {phase === PHASES.IMAGE && (
                <ImageView
                    imageSrc={currentRoundConfig?.imageSrc}
                    duration={currentRoundConfig?.imageDuration}
                    onComplete={handleImageComplete}
                />
            )}

            {phase === PHASES.DISTRACTOR && (
                <DistractorView
                    mathProblem={currentRoundConfig?.mathProblem}
                    duration={currentRoundConfig?.distractorDuration}
                    onComplete={handleDistractorComplete}
                />
            )}

            {phase === PHASES.DRAWING && (
                <DrawingView
                    onComplete={handleDrawingComplete}
                />
            )}

            {phase === PHASES.ADJUSTMENT && (
                <AdjustmentView
                    key={currentRoundIndex}
                    imageSrc={allRoundsData[currentRoundIndex]?.config.imageSrc}
                    initialRect={allRoundsData[currentRoundIndex]?.data.initialRect}
                    objectDesc={allRoundsData[currentRoundIndex]?.data.objectDesc}
                    onComplete={handleAdjustmentComplete}
                />
            )}

            {phase === PHASES.COMPLETED && (
                <Container maxWidth="sm" sx={{ py: 10 }}>
                    <Paper elevation={3} sx={{ px: 4, pb: 4, pt: 2, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
              Study Completed
                        </Typography>
                        <Typography variant="body1">
              Thank you for your participation! You may now close this window.
                        </Typography>
                    </Paper>
                </Container>
            )}
        </Box>
    );
};

export default StudyManager;
