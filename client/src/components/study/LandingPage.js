import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Button, Paper, Box, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LandingPage = ({ onStart }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/landing.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading landing page content:', err);
        setLoading(false);
      });
  }, []);

  const components = useMemo(() => ({
    h1: ({ node, ...props }) => <Typography variant="h3" gutterBottom {...props} />,
    h2: ({ node, ...props }) => <Typography variant="h4" gutterBottom {...props} />,
    h3: ({ node, ...props }) => <Typography variant="h5" gutterBottom {...props} />,
    h4: ({ node, ...props }) => <Typography variant="h6" gutterBottom {...props} />,
    p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
    li: ({ node, ...props }) => (
      <li style={{ marginBottom: '8px' }}>
        <Typography variant="body1" component="span" {...props} />
      </li>
    ),
    ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
    ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 2 }} {...props} />,
  }), []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {content}
            </ReactMarkdown>
          </Box>
        )}
        
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
