import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StudyForm = ({ timeSpent, prolificId, startTime }) => {
  const [formData, setFormData] = useState({
    age: '',
    experience: '',
    feedback: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.age || !formData.experience) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/study-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prolificId,
          timeSpent,
          responses: formData,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your responses have been successfully submitted.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time spent: {formatTime(timeSpent)}
          </Typography>
          {prolificId && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Prolific ID: {prolificId}
            </Typography>
          )}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              You can now close this window or return to Prolific.
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Study Survey
          </Typography>
          <Chip
            icon={<AccessTimeIcon />}
            label={formatTime(timeSpent)}
            color="primary"
            variant="outlined"
          />
        </Box>

        {prolificId && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Prolific ID: {prolificId}
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for participating in our study. Please answer the following questions.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset" fullWidth required>
              <FormLabel component="legend">Age Group</FormLabel>
              <RadioGroup
                value={formData.age}
                onChange={handleChange('age')}
              >
                <FormControlLabel value="18-24" control={<Radio />} label="18-24" />
                <FormControlLabel value="25-34" control={<Radio />} label="25-34" />
                <FormControlLabel value="35-44" control={<Radio />} label="35-44" />
                <FormControlLabel value="45-54" control={<Radio />} label="45-54" />
                <FormControlLabel value="55+" control={<Radio />} label="55+" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset" fullWidth required>
              <FormLabel component="legend">
                How would you rate your experience with online surveys?
              </FormLabel>
              <RadioGroup
                value={formData.experience}
                onChange={handleChange('experience')}
              >
                <FormControlLabel value="novice" control={<Radio />} label="Novice" />
                <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
                <FormControlLabel value="experienced" control={<Radio />} label="Experienced" />
                <FormControlLabel value="expert" control={<Radio />} label="Expert" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Additional Feedback (Optional)"
              multiline
              rows={4}
              fullWidth
              value={formData.feedback}
              onChange={handleChange('feedback')}
              placeholder="Please share any additional thoughts or feedback..."
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
          Your time on this page is being monitored for research purposes.
        </Typography>
      </Paper>
    </Container>
  );
};

export default StudyForm;
