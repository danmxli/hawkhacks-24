const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const { Readable } = require("stream");
const xlsx = require("xlsx");

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
  const { fileName } = req.params;
  console.log('sendEmail route triggered')
  const pdfFilePath = path.join(
    __dirname,
    "..",
    "data",
    "downloaded-pdfs",
    fileName
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
    to: "awesomejohndoetest69420@gmail.com", // List of receivers
    subject: "PDF FILE!!!!", // Subject line
    text: "Hello, this is a test invoice email sent from our Express server!", // Plain text body
    html:
      "<b>Hello John, this is a test invoice email sent from our Express server!</b>", // HTML body
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

const downloadExpensesXLSX = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receipts = user.receipts.map(receipt => receipt.toObject()); // Convert Mongoose documents to plain objects
    console.log('Receipts:', receipts); // Log receipts to verify data

    const categoryGroups = {};

    receipts.forEach((receipt) => {
      const category = receipt.CATEGORY; // CATEGORY is now a String in the schema
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }

      // Use all keys in the receipt schema
      categoryGroups[category].push(receipt);
    });

    console.log('Category Groups:', categoryGroups); // Log category groups to verify data

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Add a worksheet for each unique category found
    Object.keys(categoryGroups).forEach((category) => {
      const worksheet = xlsx.utils.json_to_sheet(categoryGroups[category]);
      xlsx.utils.book_append_sheet(workbook, worksheet, category); // Name the sheet after the category
    });

    // Write the Excel file to a buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers to prompt download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Expenses.xlsx"'
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error while downloading Excel file:", error);
    return res.status(500).json({ message: "Failed to download Excel file" });
  }
};


module.exports = {
  downloadEmails,
  sendEmail,
  getEmailPdf,
  downloadExpensesXLSX,
};
