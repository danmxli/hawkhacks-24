// this doesnt actually authetnicate the user it just checks if the user has logged in with google in the past and has not logged out yet
const authenticateUser = (req, res, next) => {
  if (!req.session.user || !req.session.user.email) {
    return res.send({ user: null})
  }
  return next();
};

module.exports = { authenticateUser };
