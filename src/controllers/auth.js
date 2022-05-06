class AuthController {
  getLoginView(req, res) {
    return res.render("login");
  }
  getSignUpView(req, res) {
    return res.render("signup");
  }
  signUp(req, res) {
    console.log(req.body);
    return res.end("Registrando a un usuario...");
  }
}

module.exports = AuthController;