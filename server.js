const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Serve the admin panel
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'College Admin Panel Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 College Admin Panel Server Started!
📍 Local URL: http://localhost:${PORT}
📖 Admin Panel: http://localhost:${PORT}
🏥 API URL: https://collegeapi-mnni.onrender.com

Ready to manage colleges! 🎓
    `);
});

module.exports = app;
