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
          profilePic: null || 'http://images7.memedroid.com/images/UPLOADED670/5dc6f5f02c9f6.jpeg',
          password: '12345'
        }
      */
      return res.render("profile", { user });
    }
  }

  async getUpdateProfileView(req, res) {
    const { username } = req.params;
    if(username !== req.session.username) {
      return res.redirect("/notAllowed");
    }
    
    const userData = await User.getByUsername(username);
    const user = userData[0];
    if(!user) {
      return res.render("notFound");
    }

    return res.render("updateProfile", { user, errors: ["XD"] });
  }

  async updateProfile(req, res) {
    if(req.params.username !== req.session.username) {
      return res.redirect("notAllowed");
    }
    const user = req.body;
    const fallbackUser = {
      name: user.name,
      username: user.username,
      profilePic:`/tmp/img/${req.session.username}`,
      email: user.email,
      birthday: user.birthday
    }
    if(!user.name || !user.username || !user.email || !user.birthday || !user.oldPassword || !user.newPassword || !user.newPasswordRepeated) {
      return res.render("updateProfile", {user:fallbackUser, errors:["Fill all the fields"]});
    }
    if(user.newPassword !== user.newPasswordRepeated) {
      return res.render("updateProfile", {user:fallbackUser, errors:["New passwords don't match"]});
    }
    return res.json({message:"Partial Success!"});
  }
}

module.exports = ProfileController;