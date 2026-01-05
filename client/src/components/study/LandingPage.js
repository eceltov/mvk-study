import React, { useMemo } from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import landingContent from '../../landing.md';

const LandingPage = ({ onStart }) => {
    const components = useMemo(() => ({
        h1: ({ ...props }) => <Typography variant="h3" gutterBottom {...props} />,
        h2: ({ ...props }) => <Typography variant="h4" gutterBottom {...props} />,
        h3: ({ ...props }) => <Typography variant="h5" gutterBottom {...props} />,
        h4: ({ ...props }) => <Typography variant="h6" gutterBottom {...props} />,
        p: ({ ...props }) => <Typography variant="body1" paragraph {...props} />,
        li: ({ ...props }) => (
            <li style={{ marginBottom: '8px' }}>
                <Typography variant="body1" component="span" {...props} />
            </li>
        ),
        ul: ({ ...props }) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
        ol: ({ ...props }) => <Box component="ol" sx={{ pl: 2 }} {...props} />,
    }), []);

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                        {landingContent}
                    </ReactMarkdown>
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
