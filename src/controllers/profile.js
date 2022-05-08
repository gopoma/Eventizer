const User = require("../models/User");

class ProfileController {
  async renderProfile(req, res) {
    const { username } = req.params;
    const userData = await User.getByUsername(username);
    const user = userData[0];

    if(!user) {
      return res.render("notFound");
    } else {
      /*
        {
          id: 57,
          name: 'Gustavo13',
          username: 'gopoma13',
          email: 'gordono13@unsa.edu.pe',
          birthday: 2004-05-12T05:00:00.000Z,
          profilePic: null | 'http://images7.memedroid.com/images/UPLOADED670/5dc6f5f02c9f6.jpeg',
          password: '12345'
        }
      */
      return res.render("profile", { user });
    }
  }
}

module.exports = ProfileController;