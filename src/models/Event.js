const { query, insert, update, del } = require("../libs/database");
class Event {
  idEvent
  constructor(event) {
    this.idHost = event.idHost;
    this.title = event.title.trim();
    this.description = event.description.trim();
    this.realization = event.realization;
    this.eventPicture = event.eventPicture;
  }

  validate() {
    let validation = {success:true,errors:[]};

    if(!this.idHost || !this.title || !this.description || !this.realization) {
      validation.success = false;
      validation.errors.push("Fill all the fields");
    }

    return validation;
  }

  async save() {
    const newEvent = await insert("events", {
      idHost: this.idHost,
      title: this.title,
      description: this.description,
      realization: this.realization,
      eventPicture: this.eventPicture
    });

    this.idEvent = newEvent?.data?.id;

    return newEvent;
  }

  static async getAll() {
    return await query("SELECT *, events.id AS idEvent FROM events JOIN users ON events.idHost=users.id ORDER BY events.realization");
  }

  static async getById(idEvent) {
    return await query("SELECT * FROM events WHERE id=?", [idEvent]);
  }

  static async getByHost(idHost) {
    return await query("SELECT * FROM events WHERE idHost=?", [idHost]);
  }

  static async getGuests(idEvent) {
    return await query("SELECT * FROM guests JOIN users ON guests.idGuest=users.id WHERE guests.idEvent=?", [idEvent]);
  }

  static async addGuest(idEvent, idGuest) {
    try {
      await query("INSERT INTO guests(idEvent, idGuest) VALUES (?, ?)", [idEvent, idGuest]);
      return {success: true};
    } catch(error) {
      console.log(error);
      return {success:false};
    }
  }

  static async update(id, data) {
    try {
      const possibleFields = ["idHost", "title", "description", "eventPicture", "realization"];
      await update("events", possibleFields, data, id);
      return {success:true};
    } catch(error) {
      console.log(error);
      return {success:false};
    }
  }

  static async deleteById(idEvent) {
    return await del("events", idEvent);
  }
}

module.exports = Event;