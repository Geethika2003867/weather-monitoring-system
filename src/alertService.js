// src/alertService.js
const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password' // Use environment variables for security
    }
});

function sendAlert(condition, temperature) {
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: 'recipient_email@gmail.com',
        subject: 'Weather Alert',
        text: `Alert! The temperature is ${temperature}°C with condition: ${condition}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error(error);
        }
        console.log('Alert sent:', info.response);
    });
}

module.exports = { sendAlert };
