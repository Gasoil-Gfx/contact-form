const express = require('express');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();


const { EMAIL_USER, EMAIL_PASS, RECEIVER_EMAIL} = process.env;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});


const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));



app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});


app.post('/contact', upload.none(), async (req, res) => {
  const { contactFullName, contactEmail, contactPhone, contactMsgSubject, contactMessage } = req.body;
  const mailOptions = {
    from: contactEmail,
    to: RECEIVER_EMAIL,
    subject: 'New message from your website contact form',
    text: `Name: ${contactFullName}\nEmail: ${contactEmail}\nPhone: ${contactPhone}\nSubject: ${contactMsgSubject}\nMessage: ${contactMessage}`
  };
  

  try {
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));