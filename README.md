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

2. Install dependencies:
```bash
# Install root dependencies (ESLint)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure Environment:
   - Create a `.env` file in the `server` directory (see `server/.env.example` if available, or use the provided `.env`).
   - Ensure `MASTER_IMAGE_DIR` points to your image dataset.

## Running the Application

### Production Mode (Recommended)
This builds the client and serves it via the Node.js server, simulating the production environment.

1. Build the client:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```
The application will be available at `http://localhost:5000`.

### Development Mode
For active development with Hot Module Replacement (HMR).

1. Start the server (Terminal 1):
```bash
cd server
npm start
```

2. Start the client (Terminal 2):
```bash
cd client
npm start
```
The client will run on `http://localhost:3000` (or another available port) and proxy API requests to the server.

## Linting

To check for code quality issues:
```bash
npm run lint
```

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
