const { query, insert, del } = require("../libs/database");
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

  static async getById(idEvent) {
    return await query("SELECT * FROM events WHERE id=?", [idEvent]);
  }

  static async getByHost(idHost) {
    return await query("SELECT * FROM events WHERE idHost=?", [idHost]);
  }

  static async deleteById(idEvent) {
    return await del("events", idEvent);
  }
}

module.exports = Event;