const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/User");
class AuthController {
  getLoginView(req, res) {
    return res.render("login");
  }

  async logIn(req, res) {
    const credenciales = req.body;
    const userData = await User.getByEmail(credenciales.email);

    if(!credenciales.email || !credenciales.password) {
      return res.render("login", {
        errors: ["Fill all the fields"]
      });
    }
    if(userData.length === 0) {
      return res.render("login", {
        errors: ["Unregistered user"]
      });
    }
    if(!(await bcrypt.compare(credenciales.password, userData[0].password))) {
      return res.render("login", {
        errors: ["Wrong credencials"]
      });
    }

    req.session.loggedIn = true;
    req.session.idUser = userData[0].id;
    req.session.email = userData[0].email;
    req.session.username = userData[0].username;

    return res.redirect(`/profile/${req.session.username}`);
  }

  getSignUpView(req, res) {
    return res.render("signup");
  }
  
  async signUp(req, res) {
    let profilePic = null;
    let fileExtension;
    if(req.files) {
      profilePic = req.files.profilePic;
      fileExtension = profilePic.name.split(".")[1];
      req.body.profilePic = `/tmp/img/users/${req.body.username}.${fileExtension}`;
    }

    const newUser = new User(req.body);
    const validation = newUser.validate();

    if(validation.success) {
      const userSaved = await newUser.save();

      if(userSaved.success) {
        if(profilePic) {
          profilePic.mv(path.join(__dirname, "..", "static", "tmp", "img", "users", `${userSaved.data.username}.${fileExtension}`), async error => {
            return res.redirect("/auth/login");
          });
        } else {
          return res.redirect("/auth/login");
        }
      } else {
        validation.success = false;
        validation.errors = [userSaved.error];

        return res.render("signup", {
          user: req.body,
          errors: validation.errors
        });
      }
    } else {
      return res.render("signup", {
        user: req.body,
        errors: validation.errors
      });
    }
  }

  logOut(req, res) {
    req.session.destroy();
    return res.redirect("/auth/login");
  }
}

module.exports = AuthController;