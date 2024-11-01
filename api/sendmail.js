const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure this is included if using environment variables

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, email, subject, message } = req.body;
        
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: subject,
            text: `From: ${username} <${email}>\n\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};
