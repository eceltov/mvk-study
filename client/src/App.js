import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StudyManager from './components/study/StudyManager';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [prolificId, setProlificId] = useState('');
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Capture Prolific ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('PROLIFIC_PID') || urlParams.get('prolific_id') || '';
    setProlificId(pid);

    // Update time spent every second
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <StudyManager prolificId={prolificId} globalTimeSpent={timeSpent} />
      </div>
    </ThemeProvider>
  );
}


export default App;
