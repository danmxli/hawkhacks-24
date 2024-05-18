const express = require("express");
const router = express.Router();
const { emailControllers } = require("../controllers"); 
const { authenticateUser } = require("../middleware/authMiddleware");
const bodyParser = require('body-parser')

router.get("/download-emails", authenticateUser, emailControllers.downloadEmails);
router.get("/send-email", authenticateUser, emailControllers.sendEmail);

module.exports = router;
