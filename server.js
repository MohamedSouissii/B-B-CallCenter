// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Allow PORT to be set via environment variables

// Enable CORS for all origins
app.use(cors());

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Configure Nodemailer to use your email service (e.g., Gmail)
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email from .env file
        pass: process.env.EMAIL_PASS,   // Your password from .env file
    },
});

// Endpoint to send email
app.post('/api/send-email', (req, res) => {
    const { username, email, subject, message } = req.body;

    const mailOptions = {
        from: email, // The sender's email
        to: process.env.EMAIL_USER, // The email address to receive messages (same as sender)
        subject: subject,
        text: `From: ${username} <${email}>\n\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }
        res.json({ success: true, message: 'Email sent successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
