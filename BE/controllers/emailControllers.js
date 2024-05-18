const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const { Readable } = require("stream");

const {
  TextractClient,
  AnalyzeExpenseCommand,
} = require("@aws-sdk/client-textract");
const User = require("../schemas/userSchema");
const { formatDateAndGenerateCategory } = require("../services/chatGPTService");

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
  console.log('sendEmail route triggered')
  const pdfFilePath = path.join(
    __dirname,
    "..",
    "data",
    "downloaded-pdfs",
    "foodie-fruitie.pdf"
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
    
    const { formattedDate, category } = await formatDateAndGenerateCategory(extractedData);
    extractedData.INVOICE_RECEIPT_DATE = formattedDate;
    extractedData.CATEGORY = category || 'food';
    extractedData.FILE_NAME = path.basename(pdfFilePath);
    console.log('extractedData', extractedData)
    const user = await User.findOneAndUpdate(
      { email: req.session.user.email },
      { $push: { receipts: extractedData }, $set: { isEmailSynced: true } },
      { new: true, upsert: true }
    );
    console.log('sendEmail route completed')
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

const getEmailPdf = async (req, res) => {
  const { fileName } = req.params;
  console.log(req.params)
  const pdfFilePath = path.join(
    __dirname,
    "..",
    "data",
    "downloaded-pdfs",
    fileName
  );

  if (!fs.existsSync(pdfFilePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    const fileBuffer = fs.readFileSync(pdfFilePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileName}-page-1.pdf"`
    );

    // Stream the PDF file
    const readStream = new Readable();
    readStream._read = () => {}; // _read is required but you can noop it
    readStream.push(fileBuffer);
    readStream.push(null); // Indicates the end of the stream (EOF)

    readStream.pipe(res);
  } catch (error) {
    console.error("Error sending PDF file:", error);
    res.status(500).send("An error occurred while sending the PDF file.");
  }
};



module.exports = {
  downloadEmails,
  sendEmail,
  getEmailPdf
};
