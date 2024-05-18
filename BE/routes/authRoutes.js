const express = require("express");
const router = express.Router();
const {
  handleGoogleLogin,
  handleGoogleCallback,
  handleLogout,
  refreshAccessToken,
} = require("../controllers/authControllers");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/google", handleGoogleLogin);
router.get("/google/callback", handleGoogleCallback);
router.get("/logout", authenticateUser, handleLogout);
router.get("/refresh-access-token", authenticateUser, refreshAccessToken);

module.exports = router;
