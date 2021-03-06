const path = require("path");
const bcrypt = require("bcrypt");
const encrypt = require("../helpers/encrypt");
const parseDateString = require("../helpers/parseDateString");
const User = require("../models/User");
const Event = require("../models/Event");
class ProfileController {
  async renderProfile(req, res) {
    const { username } = req.params;
    const [user] = await User.getByUsername(username);
    const eventData = await Event.getRelatedEvents(user?.id);
    const events = eventData.map(event => {
      return {
        ...event,
        date: parseDateString(event.realization),
        isHost: event.idHost === user.id
      }
    });
    
    if(!user) {
      return res.render("notFound");
    }
    return res.render("profile", { username, user, events });
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
    if(!(await bcrypt.compare(user.oldPassword, storedUserData.password))) {
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
    user.password = await encrypt(user.password);
    const result = await User.update(req.session.idUser, user);
    if(!result.success) {
      return res.render("updateProfile", {user:fallbackUser, errors:result.errors});
    }

    if(!profilePic) {
      return res.redirect("/auth/logout");
    }
    profilePic.mv(path.join(__dirname, "..", "static", "tmp", "img", "users", `${user.username}.${fileExtension}`), async error => {
      return res.redirect("/auth/logout");
    });
  }
}

module.exports = ProfileController;