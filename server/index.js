const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React app in production
app.use(express.static(path.join(__dirname, '../client/build')));

// API endpoint to log study data (can be extended as needed)
app.post('/api/study-data', (req, res) => {
  const { timeSpent, responses, prolificId } = req.body;
  
  // In a real application, you would save this data to a database
  console.log('Study data received:', {
    prolificId,
    timeSpent,
    responses,
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true, message: 'Data received' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
