# MVK Study - Prolific Research Web App

A Single Page Application (SPA) for conducting research studies via Prolific. Built with React, Material-UI, and a minimal Node.js Express server.

## Features

- ✨ Modern, responsive UI using Material-UI
- ⏱️ Automatic time tracking to monitor participant engagement
- 🔗 Prolific integration with URL parameter capture
- 📊 Study form with validation
- 🎨 Clean, professional design
- 🚀 SPA architecture for optimal user experience

## Project Structure

```
mvk-study/
├── client/          # React SPA frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── StudyForm.js
│       ├── App.js
│       ├── App.css
│       └── index.js
├── server/          # Node.js Express backend
│   └── index.js
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mvk-study
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

## Development

### Running in Development Mode

1. Start the server (from the `server` directory):
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

2. In a new terminal, start the client (from the `client` directory):
```bash
cd client
npm start
```
The React app will run on `http://localhost:3000` and proxy API requests to the server.

### Testing with Prolific Parameters

To test the Prolific integration, visit:
```
http://localhost:3000?PROLIFIC_PID=test-user-123
```

The app will capture the Prolific ID from the URL parameter.

## Production Deployment

1. Build the React app:
```bash
cd client
npm run build
```

2. The server is configured to serve the built React app from the `client/build` directory.

3. Start the server:
```bash
cd server
npm start
```

4. Access the application at `http://localhost:5000`

## Environment Variables

- `PORT`: Server port (default: 5000)

Create a `.env` file in the server directory for custom configuration:
```
PORT=5000
```

## API Endpoints

### POST /api/study-data
Submit study responses and time tracking data.

**Request Body:**
```json
{
  "prolificId": "string",
  "timeSpent": "number (seconds)",
  "responses": {
    "age": "string",
    "experience": "string",
    "feedback": "string"
  },
  "startTime": "ISO date string",
  "endTime": "ISO date string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data received"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "ISO date string"
}
```

## Features Explained

### Time Tracking
The app automatically tracks how long participants spend on the page:
- Timer starts when the page loads
- Updates every second
- Displayed in MM:SS format
- Submitted with form data

### Prolific Integration
The app captures Prolific participant IDs from URL parameters:
- Supports `PROLIFIC_PID` parameter (Prolific standard)
- Also supports `prolific_id` as fallback
- Displays participant ID in the UI
- Includes in submitted data

### Form Validation
- Required fields are validated before submission
- Clear error messages for incomplete forms
- Loading state during submission
- Success confirmation after submission

## Customization

### Adding More Questions
Edit `client/src/components/StudyForm.js` to add more form fields:

```javascript
const [formData, setFormData] = useState({
  age: '',
  experience: '',
  feedback: '',
  // Add your new fields here
});
```

### Styling
The app uses Material-UI's theming system. Modify the theme in `client/src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    // Customize colors here
  },
});
```

### Data Storage
The current server logs data to the console. To persist data:
1. Add a database (e.g., MongoDB, PostgreSQL)
2. Update the `/api/study-data` endpoint in `server/index.js`
3. Implement proper data storage logic

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
