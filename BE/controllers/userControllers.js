const asyncHandler = require("express-async-handler");
const User = require("../schemas/userSchema");

const getUserInfo = asyncHandler(async (req, res) => {
  const user = User.findOne({ email: req.session.email });
  res.status(200).json({ user: user.toObject() });
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    if (!(await User.exists({ email: req.session.email }))) {
      return res.status(400).json({ message: `User not found` });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: req.session.email },
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  getUserInfo,
  updateUser,
};
