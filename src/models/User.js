const { query, insert } = require("../libs/database");

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
      password: this.password
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
    const fields = ["name", "username", "email", "birthday", "profilePic", "password"];
    let escapeAssigns = "";
    const keyValueSeries = [];
    for(let i = 0; i < fields.length - 1; i++) {
      if(data[fields[i]] && data[fields[i]].trim()) {
        escapeAssigns += "??=?,"
        keyValueSeries.push(fields[i], data[fields[i]].trim())
      }
    }
    if(data[fields[fields.length - 1]] && data[fields[fields.length - 1]].trim()) {
      escapeAssigns += "??=?";
      keyValueSeries.push(fields[fields.length - 1], data[fields[fields.length - 1]].trim());
    }
    
    try {
      await query(`UPDATE users SET ${escapeAssigns} WHERE id=?`, [...keyValueSeries, id]);
      return {success:true};
    } catch(error) {
      return {success:false, errors:[error]};
    }
  }
}

module.exports = User;