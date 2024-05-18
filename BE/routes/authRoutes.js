const express = require('express');
const router = express.Router();
const { handleGoogleLogin, handleGoogleCallback, handleLogout } = require('../controllers/authControllers');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/google', handleGoogleLogin);
router.get('/google/callback', handleGoogleCallback);
router.get('/logout', authenticateUser, handleLogout)

module.exports = router;