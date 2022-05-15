function verifyNoSession(req, res, next) {
  if(req.session.loggedIn) {
    return res.redirect(`/profile/${req.session.username}`);
  }

  return next();
}

module.exports = verifyNoSession;
