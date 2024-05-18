const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const googleOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const downloadEmails = asyncHandler(async (req, res) => {

  googleOAuth2Client.setCredentials({
    access_token: req.session.user.accessToken,
    refresh_token: req.session.user.refreshToken
  });

  const gmail = google.gmail({ version: 'v1', auth: googleOAuth2Client });

  const emails = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 1, // Fetch only the newest email
  });

  if (!emails.data.messages || emails.data.messages.length === 0) {
    return res.status(404).json({ message: 'No emails found' });
  }

  const message = emails.data.messages[0];
  const msg = await gmail.users.messages.get({
    userId: 'me',
    id: message.id,
  });

  const emailBody = msg.data.payload.parts.find(part => part.mimeType === 'text/html');
  if (!emailBody) {
    return res.status(404).json({ message: 'No HTML body found in the email' });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(Buffer.from(emailBody.body.data, 'base64').toString('utf-8'));
  const pdfsDir = path.join(__dirname, '..', 'data', 'downloaded-pdfs');
  fs.mkdirSync(pdfsDir, { recursive: true });
  const pdfFilePath = path.join(pdfsDir, 'newest-email.pdf');
  await page.pdf({ path: pdfFilePath, format: 'A4' });
  await browser.close();

  res.json({ message: 'Newest email PDF saved successfully' });
});

const handlePushNotification = asyncHandler(async (req, res) => {
  // call when a new email is received, download the new email as pdf
});

module.exports = {
  downloadEmails,
  handlePushNotification
};
