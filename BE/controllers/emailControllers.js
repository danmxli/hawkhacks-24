const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const downloadEmails = asyncHandler(async (req, res) => {
        if (!req.session.tokens) {
          return res.redirect('/login');
        }
      
        OAuth2Client.setCredentials(req.session.tokens);
        const gmail = google.gmail({ version: 'v1', auth: OAuth2Client });
      
        // Fetch the list of emails
        const emails = await gmail.users.messages.list({
          userId: 'me',
          maxResults: 100, // Adjust as needed
        });
      
        const messages = [];
        for (const message of emails.data.messages) {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });
          messages.push(msg.data);
        }
      
        const pdfsDir = path.join(__dirname, '..', 'data', 'downloaded-pdfs');
        fs.mkdirSync(pdfsDir, { recursive: true });
    
        let count = 1;
        for (const msg of messages) {
            const doc = new PDFDocument();
            const pdfFilePath = path.join(pdfsDir, `email${count}.pdf`);
            const pdfStream = fs.createWriteStream(pdfFilePath);
            doc.pipe(pdfStream);
            doc.text(JSON.stringify(msg.payload.headers, null, 2));
            doc.end();
            count++;
        }
    
        res.json({ message: 'PDFs saved successfully' });
});

module.exports = {
    downloadEmails,
};