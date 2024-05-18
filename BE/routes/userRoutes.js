const express = require("express");
const router = express.Router();
const {
  getUserInfo,
  updateUser,
} = require("../controllers/userControllers");
const { authenticateUser } = require("../middleware/authMiddleware");
require('dotenv').config();

router.get("/", authenticateUser, getUserInfo);
router.put("/", authenticateUser, updateUser);

module.exports = router;