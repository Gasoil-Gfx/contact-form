const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();


const { EMAIL_USER, EMAIL_PASS } = process.env;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});


const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});


app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: EMAIL_USER,
    subject: 'New message from your website contact form',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  try {
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    res.send('Thank you for your message!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
