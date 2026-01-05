import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'black',
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Study Target"
          style={{ width: '682px', height: '384px', objectFit: 'cover' }}
        />
      ) : (
        <Box sx={{ width: 682, height: 384, bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
           Image Placeholder
        </Box>
      )}
    </Box>
  );
};

export default ImageView;
