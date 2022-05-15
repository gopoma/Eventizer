function verifySession(req, res, next) {
  if(!req.session.loggedIn) {
    return res.redirect("/notAllowed");
  }

  return next();
}

module.exports = verifySession;