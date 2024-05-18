const express = require("express");
const router = express.Router();
const { emailControllers } = require("../controllers"); 
const { authenticateUser } = require("../middleware/authMiddleware");
const bodyParser = require('body-parser')

router.get("/download-emails", authenticateUser, emailControllers.downloadEmails);
router.get("/send-email", authenticateUser, emailControllers.sendEmail);
router.post('/get-email-pdf', authenticateUser, emailControllers.getEmailPdf)

module.exports = router;
