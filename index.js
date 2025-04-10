const express = require('express');
const transporter = require('./nodemailer-config');
require('dotenv').config();
const cors = require('cors');
const { doc, setDoc } = require("firebase/firestore"); 
const  db  = require('./firebaseConfig');

const app = express();
app.use(express.json());
app.use(cors()); 

app.post('/send-note', async (req, res) => {
  const { to, subject, content,name,email,interest,message } = req.body;

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
    
    if(content.includes("Interested As")){
      await setDoc(doc(db, "waitlist", Date.now().toString()), { 
        name: name,
        email: email,
        interest,interest,
        message: message
      });
    }
    
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
