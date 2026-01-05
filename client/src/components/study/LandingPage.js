import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';

const LandingPage = ({ onStart }) => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Marine Image Study
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the study. In this experiment, you will be shown a series of marine images.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Instructions:</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body1" paragraph>
              First, you will see an image of a marine environment for a few seconds. Pay close attention to the details.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              Next, a distractor image will appear briefly.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              Then, you will see a white canvas. Please draw a rectangle where you remember seeing a specific object of interest.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              You will also be asked to describe the scene and the object you identified.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              Finally, the original image will reappear with your rectangle. You can adjust the position of the rectangle to where you think the object actually was.
            </Typography>
          </li>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" size="large" onClick={onStart}>
            Start Study
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LandingPage;
