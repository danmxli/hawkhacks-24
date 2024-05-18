const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch"); // Ensure 'node-fetch' is installed or use global fetch if available
const User = require("../schemas/userSchema");
const asyncHandler = require("express-async-handler");


require("dotenv").config();

const googleOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

// Function to initiate Google login
const handleGoogleLogin = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const authorizeUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

// Function to handle the Google OAuth2 callback
const handleGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    const userData = await response.json();
    req.session.user = {
      email: userData.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
    if (!(await User.exists({ email: userData.email }))) {
      await User.create({ email: userData.email });
    }
    return res.redirect("http://localhost:3001/expenses");
  } catch (err) {
    console.error("Error logging in with OAuth2", err);
    return res.status(500).json({ message: err.message });
  }
};

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

const refreshAccessToken = async (req, res) => {
  try {
    const { tokens } = await googleOAuth2Client.refreshToken(req.session.user.refreshToken);
    googleOAuth2Client.setCredentials(tokens);
    req.session.user.accessToken = tokens.access_token;
    res.json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


module.exports = {
  handleGoogleLogin,
  handleGoogleCallback,
  handleLogout,
  refreshAccessToken,
};
