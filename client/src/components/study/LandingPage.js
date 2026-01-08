import React, { useMemo, useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

// Load all markdown files from instructions folder
const instructionsContext = require.context('../../instructions', false, /\.md$/);
const instructionFiles = instructionsContext.keys().sort((a, b) => {
    const nA = parseInt(a.replace('./', '').replace('.md', ''));
    const nB = parseInt(b.replace('./', '').replace('.md', ''));
    return nA - nB;
});
// Handle both string content (asset/source) and ES module export
const pagesContent = instructionFiles.map(file => {
    const mod = instructionsContext(file);
    return mod.default || mod;
});

const LandingPage = ({ onStart }) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageTimings, setPageTimings] = useState([]);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        setStartTime(Date.now());
    }, [pageIndex]);

    const handleNext = () => {
        const duration = Date.now() - startTime;
        const newTimings = [...pageTimings, { page: pageIndex, duration }];
        setPageTimings(newTimings);
        
        if (pageIndex < pagesContent.length - 1) {
            setPageIndex(prev => prev + 1);
        } else {
            // Finished all pages
            onStart(newTimings);
        }
    };

    const handlePrevious = () => {
        if (pageIndex > 0) {
            const duration = Date.now() - startTime;
            const newTimings = [...pageTimings, { page: pageIndex, duration }];
            setPageTimings(newTimings);
            setPageIndex(prev => prev - 1);
        }
    };

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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ px: 4, pb: 4, pt: 1 }}>
                <Box>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                        {pagesContent[pageIndex]}
                    </ReactMarkdown>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    {pageIndex > 0 && (
                        <Button 
                            variant="outlined" 
                            size="large" 
                            onClick={handlePrevious}
                        >
                            Previous
                        </Button>
                    )}
                    <Button variant="contained" color="primary" size="large" onClick={handleNext}>
                        {pageIndex < pagesContent.length - 1 ? 'Next' : 'Start Study'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LandingPage;
