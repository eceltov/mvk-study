import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';

const AdjustmentView = ({ imageSrc, initialRect, objectDesc, onComplete }) => {
    const [rect, setRect] = useState(initialRect);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [submitting, setSubmitting] = useState(false);

    const containerRef = useRef(null);

    // Ensure rect is valid on mount
    useEffect(() => {
        if (initialRect) {
            setRect(initialRect);
        }
    }, [initialRect]);

    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent text selection
        const containerRect = containerRef.current.getBoundingClientRect();

        setDragOffset({
            x: e.clientX - (containerRect.left + rect.x),
            y: e.clientY - (containerRect.top + rect.y)
        });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) {
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate new position relative to container
        // We need to account for the container's position on screen
        // But since rect.x/y are relative to container, we just need mouse movement

        // Actually, simpler approach:
        // New X = Mouse X - Container Left - Drag Offset X

        let newX = e.clientX - containerRect.left - dragOffset.x;
        let newY = e.clientY - containerRect.top - dragOffset.y;

        // Boundary checks
        const maxX = 682 - rect.width;
        const maxY = 384 - rect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setRect(prev => ({
            ...prev,
            x: newX,
            y: newY
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onComplete(rect);
        }
        catch (error) {
            console.error("Error submitting round:", error);
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ px: 3, pb: 3, pt: 1 }}>
                <Typography variant="h6" gutterBottom>
          Adjust the rectangle to the correct position.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <div
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                            width: '682px',
                            height: '384px',
                            position: 'relative',
                            backgroundImage: `url(${imageSrc})`,
                            backgroundSize: 'cover',
                            border: '1px solid #ccc'
                        }}
                    >
                        {!imageSrc && (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#eee' }}>
                    Image Placeholder
                            </Box>
                        )}

                        <div
                            onMouseDown={handleMouseDown}
                            style={{
                                position: 'absolute',
                                left: rect.x,
                                top: rect.y,
                                width: rect.width,
                                height: rect.height,
                                border: '2px solid red',
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                cursor: isDragging ? 'grabbing' : 'grab'
                            }}
                        />
                    </div>
                </Box>

                {objectDesc && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Your Description:
                        </Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                            {objectDesc}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        size="large"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : 'Save'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdjustmentView;
