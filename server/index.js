const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Debugging process exit
process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Configuration for image directories
// Use environment variables or fallback to local folders
// Resolve to absolute paths to avoid ambiguity
let MASTER_IMAGE_DIR = path.resolve(process.env.MASTER_IMAGE_DIR || path.join(__dirname, 'images'));
const IMAGE_METADATA_FILE = path.join(__dirname, 'image_metadata.json');

// Check if MVK folder exists inside the configured directory
if (fs.existsSync(path.join(MASTER_IMAGE_DIR, 'MVK'))) {
    console.log(`Found MVK folder in ${MASTER_IMAGE_DIR}, using it as image source.`);
    MASTER_IMAGE_DIR = path.join(MASTER_IMAGE_DIR, 'MVK');
}

console.log('Using Image Directory:', MASTER_IMAGE_DIR);

// Ensure directory exists
if (!fs.existsSync(MASTER_IMAGE_DIR)) {
    console.error(`Error: Image directory ${MASTER_IMAGE_DIR} does not exist.`);
    process.exit(1);
}

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve images statically
// This allows accessing images via /images/subfolder/image.jpg
app.use('/images', express.static(MASTER_IMAGE_DIR));

// Handle missing images - prevent falling back to SPA index.html
app.use('/images', (req, res) => {
    res.status(404).send('Image not found');
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Serve static files from React app in production
app.use(express.static(path.join(__dirname, '../client/build')));

// Helper to get all files recursively
const getAllFiles = (dirPath, arrayOfFiles = [], relativePath = '') => {
    try {
        const files = fs.readdirSync(dirPath);

        files.forEach(function(file) {
            const fullPath = path.join(dirPath, file);
            const relPath = path.join(relativePath, file);

            if (fs.statSync(fullPath).isDirectory()) {
                getAllFiles(fullPath, arrayOfFiles, relPath);
            }
            else {
                if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
                    // Store relative path for ID and URL
                    // Normalize path separators to forward slashes for URLs
                    arrayOfFiles.push(relPath.replace(/\\/g, '/'));
                }
            }
        });
    }
    catch (e) {
        console.error(`Error reading directory ${dirPath}:`, e);
    }

    return arrayOfFiles;
};

// Cache image lists at startup
let imageList = [];

const refreshImageLists = () => {
    if (fs.existsSync(IMAGE_METADATA_FILE)) {
        console.log('Loading images from metadata file...');
        try {
            const data = fs.readFileSync(IMAGE_METADATA_FILE, 'utf8');
            imageList = JSON.parse(data);
            console.log(`Loaded ${imageList.length} images from metadata.`);
            return;
        }
        catch (err) {
            console.error('Error reading metadata file, rescanning...', err);
        }
    }

    console.log('Scanning for images...');
    imageList = getAllFiles(MASTER_IMAGE_DIR);
    console.log(`Found ${imageList.length} images.`);

    try {
        fs.writeFileSync(IMAGE_METADATA_FILE, JSON.stringify(imageList));
        console.log('Saved image metadata file.');
    }
    catch (err) {
        console.error('Error saving metadata file:', err);
    }
};

refreshImageLists();

// API endpoint to get a random round configuration
app.get('/api/random-round', (req, res) => {
    if (imageList.length === 0) {
        // Try refreshing if empty
        refreshImageLists();
        if (imageList.length === 0) {
            return res.status(500).json({ error: 'No images available in the configured directory.' });
        }
    }

    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];

    // Generate a simple math problem for distractor
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const mathProblem = `${num1} + ${num2}`;

    res.json({
        imageId: randomImage,
        imageSrc: `/images/${randomImage}`,
        distractorType: 'math',
        mathProblem: mathProblem
    });
});

// API endpoint to log study data (can be extended as needed)
app.post('/api/study-data', (req, res) => {
    const data = req.body;

    // In a real application, you would save this data to a database
    console.log('Study data received:', data);

    res.json({ success: true, message: 'Data received' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (e) => {
    console.error('Server error:', e);
});

