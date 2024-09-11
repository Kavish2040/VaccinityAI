require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust as per your frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_SPECIFIC_PASSWORD
  }
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: 'kavish.soningra@tcu.edu', // Change as needed
    subject: 'New Contact Form Message',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong.Message:</strong> ${message}</p>`
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error(err);
      res.status(500).send('Error sending email');
    } else {
      console.log(info);
      res.status(200).send('Email sent successfully');
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
