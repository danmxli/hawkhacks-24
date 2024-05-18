const User = require("../schemas/userSchema");

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUserByEmail = async (email, updateData) => {
  return await User.findOneAndUpdate(
    { email },
    updateData,
    { new: true }
  );
};

const userExists = async (email) => {
  return await User.exists({ email });
};

module.exports = {
  getUserByEmail,
  updateUserByEmail,
  userExists,
};
