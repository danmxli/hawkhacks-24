const express = require("express");
const router = express.Router();
const { emailControllers } = require("../controllers"); 
const { authenticateUser } = require("../middleware/authMiddleware");
const bodyParser = require('body-parser')

router.get("/download-emails", authenticateUser, emailControllers.downloadEmails);
router.get("/send-email/:fileName", authenticateUser, emailControllers.sendEmail);
router.get('/get-email-pdf/:fileName', authenticateUser, emailControllers.getEmailPdf)
router.get('/export-to-csv', authenticateUser, emailControllers.downloadExpensesXLSX)

module.exports = router;
