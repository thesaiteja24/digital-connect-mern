// emailSender.js
const nodemailer = require("nodemailer");
require("dotenv").config();

// Create and configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, // Enable detailed logging
  debug: true,  // Show SMTP connection logs
});

/**
 * Function to send an email.
 * @param {string} to - Receiver email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Body of the email.
 */
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendEmail;
