import React, { useEffect, useRef } from 'react';
import { Box, Container, Paper } from '@mui/material';

const ImageView = ({ imageSrc, duration, onComplete }) => {
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onCompleteRef.current) {
                onCompleteRef.current();
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Paper elevation={3} sx={{ p: 0.5, display: 'inline-block' }}>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Study Target"
                        style={{ width: '682px', height: '384px', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <Box sx={{ width: 682, height: 384, bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               Image Placeholder
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ImageView;
