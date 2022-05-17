const Event = require("../models/Event");

class EventController {
  getCreateEventView(req, res) {
    return res.render("createEvent");
  }

  async createEvent(req, res) {
    let eventPicture;
    let fileExtension;
    if(req.files && req.files.eventPicture) {
      eventPicture = req.files.eventPicture;
      fileExtension = eventPicture.name.split(".")[1];
      req.body.eventPicture = `/tmp/img/events/${req.body.title}.${fileExtension}`;
    }

    const eventData = {
      idHost: req.session.idUser,
      title: req.body.title,
      description: req.body.description,
      realization: req.body.realization,
      eventPicture: req.body.eventPicture
    };

    const newEvent = new Event(eventData);
    const validation = newEvent.validate();

    if(!validation.success) {
      return res.render("createEvent", {event:eventData, errors:validation.errors});
    }

    const eventSaved = await newEvent.save();
    if(!eventSaved.success) {
      return res.render("createEvent", {event:eventData, errors:["A wild error has appeared!"]});
    }

    return res.redirect(`/profile/${req.session.username}`);
  }
}

module.exports = EventController;