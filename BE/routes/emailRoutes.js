const express = require("express");
const router = express.Router();
const { emailControllers } = require("../controllers"); 
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/download-emails", authenticateUser, emailControllers.downloadEmails);
router.post("/push", authenticateUser, emailControllers.handlePushNotification);


module.exports = router;
