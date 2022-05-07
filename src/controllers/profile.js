const User = require("../models/User");

class ProfileController {
  async renderProfile(req, res) {
    const { username } = req.params;
    const userData = await User.getByUsername(username);
    const user = userData[0];

    if(!user) {
      res.render("profile", { message: "Not Found" });
    } else {
      res.render("profile", { message: "Found", user });
    }
  }
}

module.exports = ProfileController;