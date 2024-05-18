const asyncHandler = require("express-async-handler");
const { authService } = require('./services');

const handleGoogleLogin = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.APP_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const authorizeUrl = authService.generateGoogleAuthUrl();
  res.json({ url: authorizeUrl });
});

// Function to handle the Google OAuth2 callback
const handleGoogleCallback = async (req, res) => {
  console.log('hi')
  try {
    const code = req.query.code;
    const tokens = await authService.getTokens(code);
    const userData = await authService.getUserData(tokens.access_token);
    req.session.user = {
      email: userData.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
    await authService.findOrCreateUser(userData.email);
    return res.redirect(`${process.env.APP_URL}/dashboard`);
  } catch (err) {
    console.error("Error logging in with OAuth2", err);
    return res.status(500).json({ message: err.message });
  }
});

const handleLogout = asyncHandler(async (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    res.status(200).json({ message: "No active session" });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const tokens = await authService.refreshToken(req.session.user.refreshToken);
    req.session.user.accessToken = tokens.access_token;
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = {
  handleGoogleLogin,
  handleGoogleCallback,
  handleLogout,
  refreshAccessToken,
};
