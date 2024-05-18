const express = require("express");
const router = express.Router();
const {
  userControllers
} = require("../controllers");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/", authenticateUser, userControllers.getUserInfo);
router.put("/", authenticateUser, userControllers.updateUser);
router.get('/sync-email', authenticateUser, userControllers.syncUserEmail);

module.exports = router;
