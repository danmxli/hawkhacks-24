const asyncHandler = require("express-async-handler");
const { userService } = require('../services');
const User = require("../schemas/userSchema");

const getUserInfo = asyncHandler(async (req, res) => {
  if (!req.session.user || !req.session.user.email) {
    return res.status(200).json({ user: null });
  }
  const user = await userService.getUserByEmail(req.session.user.email);
  console.log(req.session.user.email)
  res.status(200).json({ user });
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    if (!(await userService.userExists(req.session.user.email))) {
      return res.status(400).json({ message: `User not found` });
    }

    const updatedUser = await userService.updateUserByEmail(req.session.user.email, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

const syncUserEmail = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate({ email: req.session.user.email }, { isEmailSynced: true });
  res.status(200).json({ message: 'Emails synced successfully' });
})

module.exports = {
  getUserInfo,
  updateUser,
  syncUserEmail
};
