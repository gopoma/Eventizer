const path = require("path");
const User = require("../models/User");
class AuthController {
  getLoginView(req, res) {
    return res.render("login");
  }

  async logIn(req, res) {
    const credenciales = req.body;
    const userData = await User.getByEmail(credenciales.email);
    console.log(userData);

    if(!credenciales.email || !credenciales.password) {
      return res.render("login", {
        errors: ["Rellena todos los campos"]
      });
    }
    if(userData.length === 0) {
      return res.render("login", {
        errors: ["Usuario no registrado"]
      });
    }
    if(userData[0].password !== credenciales.password) {
      return res.render("login", {
        errors: ["Credenciales incorrectas"]
      });
    }

    req.session.loggedIn = true;
    req.session.idUser = userData[0].id;
    req.session.email = userData[0].email;
    req.session.username = userData[0].username;

    return res.end("Encontrado");
  }

  getSignUpView(req, res) {
    return res.render("signup");
  }
  
  async signUp(req, res) {
    console.log(req.body);
    let profilePic = null;
    if(req.files) {
      profilePic = req.files.profilePic;
      req.body.profilePic = `/tmp/img/${profilePic.name}`;
    }

    const newUser = new User(req.body);
    const validation = newUser.validate();

    if(validation.success) {
      const userSaved = await newUser.save();

      if(userSaved.success) {
        if(profilePic) {
          profilePic.mv(path.join(__dirname, "..", "static", "tmp", "img", profilePic.name), async error => {
            return res.redirect("/auth/login");
          });
        } else {
          return res.redirect("/auth/login");
        }
      } else {
        validation.success = false;
        validation.errors = [userSaved.error];

        return res.render("signup", {
          errors: validation.errors
        });
      }
    } else {
      return res.render("signup", {
        errors: validation.errors
      });
    }
  }
}

module.exports = AuthController;