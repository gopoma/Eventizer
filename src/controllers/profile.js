const path = require("path");
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

    return res.render("updateProfile", { user });
  }

  async updateProfile(req, res) {
    // You have to be that user to modify that account!
    if(req.params.username !== req.session.username) {
      return res.redirect("notAllowed");
    }

    const user = req.body;
    const storedUserData = (await User.getByUsername(req.session.username))[0];
    const fallbackUser = {
      name: user.name,
      username: user.username,
      profilePic: storedUserData.profilePic,
      email: user.email,
      birthday: user.birthday
    }

    // Validations
    if(!user.name || !user.username || !user.email || !user.oldPassword || !user.password || !user.passwordRepeated) {
      return res.render("updateProfile", {user:fallbackUser, errors:["Fill all the fields"]});
    }
    if(user.password !== user.passwordRepeated) {
      return res.render("updateProfile", {user:fallbackUser, errors:["Confirmation mismatched"]});
    }
    if(user.oldPassword !== storedUserData.password) {
      return res.render("updateProfile", {user:fallbackUser, errors:["Invalid current password"]});
    }
    if(!user.email.match(/^[0-9a-zA-Z]+(\.[a-zA-Z]+)*@[a-zA-Z]+(\.[a-zA-Z]+)*$/)) {
      return res.render("updateProfile", {user:fallbackUser, errors:[`The email '${user.email}' isn't valid`]});
    }

    let profilePic = null;
    let fileExtension;
    if(req.files && req.files.profilePic) {
      profilePic = req.files.profilePic;
      fileExtension = profilePic.name.split(".")[1];
      user.profilePic = `/tmp/img/users/${user.username}.${fileExtension}`;
    }

    // Updating...
    const result = await User.update(req.session.idUser, user);
    if(!result.success) {
      return res.render("updateProfile", {user:fallbackUser, errors:result.errors});
    }
    if(!profilePic) {
      return res.redirect("/auth/login");
    }
    profilePic.mv(path.join(__dirname, "..", "static", "tmp", "img", "users", `${user.username}.${fileExtension}`), async error => {
      return res.redirect("/auth/login");
    });
  }
}

module.exports = ProfileController;