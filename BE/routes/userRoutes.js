const express = require("express");
const router = express.Router();
const {
  authControllers
} = require("../controllers");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/", authenticateUser, authControllers.getUserInfo);
router.put("/", authenticateUser, authControllers.updateUser);

module.exports = router;
