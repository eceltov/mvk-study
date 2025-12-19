import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StudyForm from './components/StudyForm';
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
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [prolificId, setProlificId] = useState('');

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
        <StudyForm 
          timeSpent={timeSpent} 
          prolificId={prolificId}
          startTime={startTime}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
