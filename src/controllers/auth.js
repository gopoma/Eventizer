const User = require("../models/User");
class AuthController {
  getLoginView(req, res) {
    return res.render("login");
  }
  getSignUpView(req, res) {
    return res.render("signup");
  }
  async signUp(req, res) {
    const newUser = new User(req.body);
    const validation = newUser.validate();

    if(validation.success) {
      const userSaved = await newUser.save();

      if(userSaved.success) {
        return res.json(userSaved.data);
      } else {
        validation.success = false;
        validation.errors = [userSaved.error];

        return res.json(validation);
      }
    } else {
      return res.json(validation);
    }
  }
}

module.exports = AuthController;