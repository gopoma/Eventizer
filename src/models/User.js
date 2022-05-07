const { query, insert } = require("../config/database");

class User {
  idUser
  constructor(user) {
    this.name = user.name.trim();
    this.username = user.username.trim();
    this.email = user.email.trim();
    this.birthday = user.birthday.trim();
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
    if(!this.email.match(/^[0-9a-zA-Z]+(\.[a-zA-Z]+)*@[a-zA-Z]+(\.[a-zA-Z]+)*$/)) {
      validation.success = false;
      validation.errors.push(`El email '${this.email}' no es válido`);
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

  static async getByEmail(email) {
    return await query(`SELECT * FROM users WHERE email=?`, [email]);
  }
  static async getByUsername(username) {
    return await query(`SELECT * FROM users WHERE username=?`, [username]);
  }
}

module.exports = User;