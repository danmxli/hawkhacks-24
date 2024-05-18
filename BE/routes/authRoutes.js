const express = require("express");
const router = express.Router();
const { authControllers } = require("../controllers");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/google", authControllers.handleGoogleLogin);
router.get("/google/callback", authControllers.handleGoogleCallback);
router.get("/logout", authControllers.handleLogout);
router.get("/refresh-access-token", authenticateUser, authControllers.refreshAccessToken);

module.exports = router;
