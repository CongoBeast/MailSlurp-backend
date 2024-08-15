// server.js (Express)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MailSlurp } = require('mailslurp-client');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize MailSlurp
const mailslurp = new MailSlurp({ apiKey: '49646d8ccd58d028dc35e168fd53b28be269659981b82829f33ade3150e2e6bb' }); // Replace with your MailSlurp API key

app.post('/send-email', async (req, res) => {
    const { selectedArticles } = req.body;

    // console.log(selectedArticles)

    // Create email content
    const emailContent = selectedArticles.map(article => `
        <h2>${article.title}</h2>
        <p><strong>Country:</strong> ${article.country}</p>
        <p><strong>Date:</strong> ${new Date(article.date).toLocaleDateString()}</p>
        <p>${article.article}</p>
    `).join('<br/><br/>');

    // Set up email options
    const sendEmailOptions = {
        to: ['thomastshumar@gmail.com'], // Recipient email
        subject: 'Selected Articles',
        body: emailContent,
        isHTML: true // Set to true for HTML content
    };

    try {
        // Send email using MailSlurp
        const response = await mailslurp.inboxController.sendEmailAndConfirm({ 
            inboxId: '173bed1e-5df0-45b7-875e-71bc69dd0f58', // Replace with your inbox ID
            sendEmailOptions: sendEmailOptions 
        });
        res.send(`Email sent successfully: ${response.id}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Failed to send email');
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});