const encrypt = require("../helpers/encrypt");
const { query, insert, update } = require("../libs/database");

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
    
    if(!this.name || !this.username || !this.email || !this.password || !this.passwordRepeated) {
      validation.success = false;
      validation.errors.push("Fill all the fields");
    }
    if(!this.email.match(/^[0-9a-zA-Z]+(\.[a-zA-Z]+)*@[a-zA-Z]+(\.[a-zA-Z]+)*$/)) {
      validation.success = false;
      validation.errors.push(`The email '${this.email}' isn't valid`);
    }
    if(this.password !== this.passwordRepeated) {
      validation.success = false;
      validation.errors.push("Passwords don't match");
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
      password: await encrypt(this.password)
    });

    this.idUser = newUser?.data?.id;

    return newUser;
  }

  static async getById(idUser) {
    return await query(`SELECT * FROM users WHERE id=?`, [idUser]);
  }

  static async getByEmail(email) {
    return await query(`SELECT * FROM users WHERE email=?`, [email]);
  }

  static async getByUsername(username) {
    return await query(`SELECT * FROM users WHERE username=?`, [username]);
  }

  static async update(id, data) {
    const possibleFields = ["name", "username", "email", "birthday", "profilePic", "password"];
    const result = await update("users", possibleFields, data, id);
    
    return {
      success: result.success,
      errors: [result.message]
    }
  }
}

module.exports = User;