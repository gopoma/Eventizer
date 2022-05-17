const session = require("express-session");
const path = require("path");
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
      req.body.eventPicture = `/tmp/img/events/${req.session.username}__${req.body.title}.${fileExtension}`;
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

    if(!eventPicture) {
      return res.redirect(`/profile/${req.session.username}`);
    } else {
      eventPicture.mv(path.join(__dirname, "..", "static", "tmp", "img", "events", `${req.session.username}__${req.body.title}.${fileExtension}`), async error => {
        return res.redirect(`/profile/${req.session.username}`);
      });
    }
  }

  getUpdateEventView(req, res) {
    return res.render("updateEvent");
  }

  async getDeleteEventView(req, res) {
    const {idEvent} = req.params;
    const [event] = await Event.getById(idEvent);

    if(!event) {
      return res.render("notFound");
    }
    if(req.session.idUser !== event.idHost) {
      return res.redirect("/notAllowed");
    }

    return res.render("deleteEvent", {event});
  }

  async deleteEvent(req, res) {
    const {idEvent} = req.params;
    const [event] = await Event.getById(idEvent);

    if(!event) {
      return res.render("notFound");
    }
    if(req.session.idUser !== event.idHost) {
      return res.redirect("/notAllowed");
    }

    await Event.deleteById(idEvent);
    return res.redirect(`/profile/${req.session.username}`);
  }
}

module.exports = EventController;