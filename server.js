const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MailtrapClient } = require('mailtrap');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Mailtrap
const TOKEN = "83e7628c8006186ecd7a68a3e91ba904";
const ENDPOINT = "https://send.api.mailtrap.io/";
const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

app.post('/send-email', async (req, res) => {
    const { selectedArticles , email } = req.body;

    // Create email content
    // const emailContent = selectedArticles.map(article => `
    //     <h2>${article.title}</h2>
    //     <p><strong>Country:</strong> ${article.country}</p>
    //     <p><strong>Date:</strong> ${new Date(article.date).toLocaleDateString()}</p>
    //     <p>${article.article}</p>
    // `).join('<br/><br/>');
    console.log(email)

    const emailContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #004080; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Cordelia</h1>
            <p style="margin: 0; font-size: 16px;">Here is your selection of stories</p>
        </div>

        <div style="padding: 20px;">
            ${selectedArticles.map(article => `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #004080;">${article.title}</h2>
                    <p><strong>Country:</strong> ${article.country}</p>
                    <p><strong>Date:</strong> ${new Date(article.date).toLocaleDateString()}</p>
                    <p>${article.article}</p>
                </div>
            `).join('<hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;"/>')}
        </div>

        <div style="background-color: #f2f2f2; padding: 20px; text-align: center;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Cordelia. All rights reserved.</p>
            <p style="margin: 0;">Follow us on <a href="#" style="color: #004080; text-decoration: none;">LinkedIn</a> | <a href="#" style="color: #004080; text-decoration: none;">Twitter</a></p>
        </div>
    </div>
`;

    // Set up email options
    const emailOptions = {
        from: {
            email: 'mailtrap@valcrow-tech.com', // Sender email
            name: 'You left something: Cordelia'
        },
        to: [
            { email: email} // Recipient email }
        ],
        subject: 'Selected Articles on Cordelia',
        text: 'This is a fallback text for email clients that do not support HTML.',
        html: emailContent,
        category: 'Integration Test'
    };

    try {
        // Send email using Mailtrap
        const response = await client.send(emailOptions);
        res.send(`Email sent successfully: ${response.id}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
        return res.status(500).send('Failed to send email');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
