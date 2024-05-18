const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch"); 
const User = require("../schemas/userSchema");
const googleScopes = require("../config/googleScopes");

const googleOAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const generateGoogleAuthUrl = () => {
  return googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      googleScopes
    ],
    prompt: "consent",
  });
};

const getTokens = async (code) => {
  const { tokens } = await googleOAuth2Client.getToken(code);
  googleOAuth2Client.setCredentials(tokens);
  return tokens;
};

const getUserData = async (accessToken) => {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
  return await response.json();
};

const findOrCreateUser = async (email) => {
  if (!(await User.exists({ email }))) {
    await User.create({ email });
  }
};

const refreshToken = async (refreshToken) => {
  const { tokens } = await googleOAuth2Client.refreshToken(refreshToken);
  googleOAuth2Client.setCredentials(tokens);
  return tokens;
};

module.exports = {
  generateGoogleAuthUrl,
  getTokens,
  getUserData,
  findOrCreateUser,
  refreshToken,
};
