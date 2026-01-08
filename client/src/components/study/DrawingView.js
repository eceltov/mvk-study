import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Container } from '@mui/material';

const DrawingView = ({ onComplete }) => {
    const [rect, setRect] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [globalDesc, setGlobalDesc] = useState('');
    const [objectDesc, setObjectDesc] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const canvasRef = useRef(null);

    const getMousePos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e) => {
        const pos = getMousePos(e);
        setStartPos(pos);
        setIsDrawing(true);
        setRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) {
            return;
        }
        const pos = getMousePos(e);

        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;

        setRect({
            x: width > 0 ? startPos.x : pos.x,
            y: height > 0 ? startPos.y : pos.y,
            width: Math.abs(width),
            height: Math.abs(height)
        });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleSubmit = () => {
        if (rect && globalDesc && objectDesc && !submitting) {
            setSubmitting(true);
            onComplete({
                rect,
                globalDesc,
                objectDesc
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ px: 3, pb: 3, pt: 1 }}>
                <Typography variant="h6" gutterBottom>
          Draw a rectangle where you saw the object and describe it.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <div
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                            width: '682px',
                            height: '384px',
                            border: '1px solid #ccc',
                            position: 'relative',
                            backgroundColor: 'white',
                            cursor: 'crosshair',
                            userSelect: 'none'
                        }}
                    >
                        {rect && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: rect.x,
                                    top: rect.y,
                                    width: rect.width,
                                    height: rect.height,
                                    border: '2px solid red',
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                                }}
                            />
                        )}
                    </div>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Global Description of the Frame"
                        multiline
                        rows={2}
                        value={globalDesc}
                        onChange={(e) => setGlobalDesc(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description of the Object in Rectangle"
                        multiline
                        rows={2}
                        value={objectDesc}
                        onChange={(e) => setObjectDesc(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!rect || !globalDesc || !objectDesc || submitting}
                        size="large"
                    >
            Next
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default DrawingView;
