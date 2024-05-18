// this doesnt actually authetnicate the user it just checks if the user has logged in with google in the past and has not logged out yet
const authenticateUser = (req, res, next) => {
  if (req.session) {
    return next();
  }
  res.redirect("/");
};

module.exports = { authenticateUser };
