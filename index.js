require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON
app.use(bodyParser.json());

// Route to send email
app.post('/send-email', (req, res) => {
    const { from, to, subject, body, userName, name, password,host} = req.body;

    if (!from || !to || !subject || !body || !userName || !password || !host) {
        res.status(404).send('Please enter all required information {from, to, subject, body, userName, password, host }');
        return;
    }
    // console.log(`${appPassword} ${from} ${to} ${subject} ${text} ${name}`);
    // Create a Nodemailer transporter 
    // const transporter = nodemailer.createTransport({
    //     service: 'SES', 
    //     AWSAccessKeyID: "AKIA3FLD345BXJWBMQOV", // real one in code
    //     AWSSecretKey: "AKIA3FLD345BXJWBMQOV", // real one in code
    //     ServiceUrl: 'email-smtp.us-east-1.amazonaws.com'
    // });

    // // Email data 
    // const mailOptions = {
    //     from: `Fiscalrize <no-reply@fiscalrize.com>`, // Sender email
    //     to: "pparthh75@gmail.com", // Recipient email
    //     subject: "test",
    //     text: "dfdf"
    // };

    const transporter = nodemailer.createTransport({
        host: host, // e.g., "email-smtp.us-east-1.amazonaws.com"
        port: 465, // Use 465 for secure connections, or 587 for TLS
        secure: true, // true for 465, false for 587
        auth: {
          user: userName, // Replace with your SMTP username
          pass: password, // Replace with your SMTP password
        },
      });
     
      // Email options
      const mailOptions = {
        from: `${name} <${from}>`, // Must be verified in AWS SES
        to: to, // Can be unverified if SES is in production mode
        subject: subject, 
        // text: "This is a test email sent using AWS SES via SMTP.", 
        html: body,
      };

    // Send email  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(404).send({
              "success":false,
              "message":'Error sending email',
              "data":{
                "log":error
              }
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({
              "success":true,
              "message":'Email send successfully',
              "data":{
                "log":info.response
              }
            });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});