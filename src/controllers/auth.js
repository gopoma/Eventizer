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
      return res.json({
        validation: {
          errors: ["Rellena todos los campos"]
        }
      });
    }
    if(userData.length === 0) {
      return res.json({
        validation: {
          errors: ["Usuario no registrado"]
        }
      });
    }
    if(userData[0].password !== credenciales.password) {
      return res.json({
        validation: {
          errors: ["Credenciales incorrectas"]
        }
      });
    }

    // TODO: Store the id and email in the Session Storage
    return res.end("Encontrado");
  }

  getSignUpView(req, res) {
    return res.render("signup");
  }
  
  async signUp(req, res) {
    const { profilePic } = req.files;
    req.body.profilePic = `/tmp/img/${profilePic.name}`;

    const newUser = new User(req.body);
    const validation = newUser.validate();

    if(validation.success) {
      const userSaved = await newUser.save();

      if(userSaved.success) {
        profilePic.mv(path.join(__dirname, "..", "static", "tmp", "img", profilePic.name), async error => {
          return res.json(userSaved.data);
        });
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