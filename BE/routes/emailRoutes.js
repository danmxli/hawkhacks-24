const express = require("express");
const router = express.Router();
const { emailControllers } = require("../controllers"); 
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/download-emails", emailControllers.downloadEmails);

module.exports = router;
