const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const {
  TextractClient,
  AnalyzeExpenseCommand,
} = require("@aws-sdk/client-textract");
const User = require("../schemas/userSchema");

const textractClient = new TextractClient({ region: "us-east-1" });

const googleOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const downloadEmails = asyncHandler(async (req, res) => {
  googleOAuth2Client.setCredentials({
    access_token: req.session.user.accessToken,
    refresh_token: req.session.user.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: googleOAuth2Client });

  const emails = await gmail.users.messages.list({
    userId: "me",
    maxResults: 1, // Fetch only the newest email
  });

  if (!emails.data.messages || emails.data.messages.length === 0) {
    return res.status(404).json({ message: "No emails found" });
  }

  const message = emails.data.messages[0];
  const msg = await gmail.users.messages.get({
    userId: "me",
    id: message.id,
  });

  const emailBody = msg.data.payload.parts.find(
    (part) => part.mimeType === "text/html"
  );
  if (!emailBody) {
    return res.status(404).json({ message: "No HTML body found in the email" });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(
    Buffer.from(emailBody.body.data, "base64").toString("utf-8")
  );
  const pdfsDir = path.join(__dirname, "..", "data", "downloaded-pdfs");
  fs.mkdirSync(pdfsDir, { recursive: true });
  const pdfFilePath = path.join(pdfsDir, "newest-email.pdf");
  await page.pdf({ path: pdfFilePath, format: "A4" });
  await browser.close();

  res.json({ message: "Newest email PDF saved successfully" });
});

const sendEmail = async (req, res) => {
  console.log('sendEmail')
  const pdfFilePath = path.join(
    __dirname,
    "..",
    "data",
    "downloaded-pdfs",
    "grocery-receipt.pdf"
  );

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "awesomejohndoetest69420@gmail.com",
      pass: "mmpw zaol ldci cjyi",
    },
  });

  // Set up email data
  let mailOptions = {
    from: '"Tony Qiu" <tonyqiu12345@gmail.com>', // Sender address
    to: "tonyqiu12345@gmail.com", // List of receivers
    subject: "PDF FILE!!!!", // Subject line
    text: "Hello Tony, this is a test email sent from an Express server!", // Plain text body
    html:
      "<b>Hello Tony, this is a test email sent from an Express server!</b>", // HTML body
    attachments: [
      {
        filename: path.basename(pdfFilePath),
        path: pdfFilePath,
        contentType: "application/pdf",
      },
    ],
  };

  // Send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    // Read the PDF file
    const fileStream = fs.readFileSync(pdfFilePath);

    // Analyze PDF with AWS Textract
    const textractParams = {
      Document: {
        Bytes: fileStream,
      },
    };

    const result = {};
    const command = new AnalyzeExpenseCommand(textractParams);
    const textractResponse = await textractClient.send(command);

    
    // Parse Textract response to extract relevant fields
    const extractedData = parseTextractResponse(textractResponse);
    // Find the user and update their receipts
    const userEmail = 'tonyqiu12345@gmail.com'; // Update this with the appropriate logic to get the user email
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { receipts: extractedData }, $set: { isEmailSynced: true } },
      { new: true, upsert: true }
    );

    res.send({
      message: 'Email sent and PDF analyzed successfully!',
      textractData: extractedData,
      user
    });
  } catch (error) {
    console.error("Error sending email: %s", error);
    res.status(500).send("Error sending email");
  }
};

const parseTextractResponse = (response) => {
  const fields = ['VENDOR_NAME', 'SUBTOTAL', 'INVOICE_RECEIPT_DATE', 'TAX', 'TOTAL', 'VENDOR_ADDRESS'];
  const data = {};

  response.ExpenseDocuments.forEach((document) => {
    document.SummaryFields.forEach((field) => {
      const key = field.Type.Text;
      if (fields.includes(key)) {
        data[key] = field.ValueDetection.Text;
      }
    });
  });

  return data;
};


module.exports = {
  downloadEmails,
  sendEmail,
};
