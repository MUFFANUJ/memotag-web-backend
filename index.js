const express = require('express');
const transporter = require('./nodemailer-config');
require('dotenv').config();
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.post('/send-note', async (req, res) => {
  const { to, subject, content } = req.body;

  if (!to || !subject || !content) {
    return res.status(400).json({ message: 'to, subject, and content are required' });
  }

  try {
    await transporter.sendMail({
      from: `"CONTACT FORM QUERY " <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: content,
    });

    res.status(200).json({ message: 'Email Sent Successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send Email' });
  }
});

app.get("/hello",(req,res)=>{
  res.send({message:"Its Working buddy!"})
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
