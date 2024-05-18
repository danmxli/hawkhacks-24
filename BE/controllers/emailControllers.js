const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const downloadEmails = asyncHandler(async (req, res) => {
  if (!req.session.user || !req.session.user.email) {
    return res.status(200).json({ user: null });
  }
  const googleOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/google/callback"
  );

  googleOAuth2Client.setCredentials({
    access_token: req.session.user.accessToken,
    refresh_token: req.session.user.refreshToken
  });

  const gmail = google.gmail({ version: 'v1', auth: googleOAuth2Client });

  // Fetch the list of emails
  const emails = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10, // Adjust as needed
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
  downloadEmails
}