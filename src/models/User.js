const { insert } = require("../config/database");

class User {
  idUser
  constructor(user) {
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.birthday = user.birthday;
    this.profilePic = user.profilePic;
    this.password = user.password;
    this.passwordRepeated = user.passwordRepeated;
  }

  validate() {
    let validation = {success: true, errors: []};
    
    if(!this.name || !this.username || !this.email || !this.birthday || !this.password || !this.passwordRepeated) {
      validation.success = false;
      validation.errors.push("Rellena todos los campos");
    }
    if(this.password !== this.passwordRepeated) {
      validation.success = false;
      validation.errors.push("Las contraseñas no coinciden");
    }

    return validation;
  }

  async save() {
    const newUser = await insert("users", {
      name: this.name,
      username: this.username,
      email: this.email,
      birthday: this.birthday,
      profilePic: this.profilePic,
      password: this.password
    });

    this.idUser = newUser?.data?.id;

    return newUser;
  }
}

module.exports = User;