const path = require("path");
const Event = require("../models/Event");
const User = require("../models/User");
class EventController {
  async renderEvents(req, res) {
    const eventData = await Event.getAll();
    const events = await Promise.all(eventData.map(async event => {
      const guestData = await Event.getGuest(event.idEvent, req.session.idUser);

      return {
        ...event,
        isHost: req.session.idUser === event.idHost,
        isEnlisted: guestData.length !== 0,
        host: {
          id: event.idHost,
          name: event.name,
          username: event.username,
          email: event.email,
          profilePic: event.profilePic
        }
      }
    }));
    return res.render("events", {events});
  }

  async renderEventDetails(req, res) {
    const {idEvent} = req.params;
    const [event] = await Event.getById(idEvent);
    
    if(!event) {
      return res.render("notFound");
    }
    
    const [host] = await User.getById(event.idHost);

    const guests = await Event.getGuests(event.id);
    const enlistData = guests.filter(guest => guest.idGuest === req.session.idUser);
    const canEnlist = enlistData.length === 0 && event.idHost !== req.session.idUser;

    return res.render("event", {event, host, canEnlist});
  }
  
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

  async addGuest(req, res) {
    const {idEvent} = req.params;
    await Event.addGuest(idEvent, req.session.idUser);
    return res.redirect(`/profile/${req.session.username}`);
  }

  async getUpdateEventView(req, res) {
    const {idEvent} = req.params;
    const eventData = await Event.getById(idEvent);
    const event = eventData[0];

    if(!event) {
      return res.render("notFound");
    }
    if(req.session.idUser !== event.idHost) {
      return res.redirect("/notAllowed");
    }

    return res.render("updateEvent", {event});
  }

  async updateEvent(req, res) {
    const {idEvent} = req.params;
    const eventData = await Event.getById(idEvent);
    const event = eventData[0];

    if(!event) {
      return res.render("notFound");
    }
    if(req.session.idUser !== event.idHost) {
      return res.redirect("/notAllowed");
    }

    const {title, description, realization} = req.body;
    if(!title || !description || !realization) {
      return res.render("updateEvent", {event:{...req.body, id: event.id}, errors:["Fill al the fields"]});
    }

    let eventPicture;
    let fileExtension;
    if(req.files && req.files.eventPicture) {
      eventPicture = req.files.eventPicture;
      fileExtension = eventPicture.name.split(".")[1];
    }
    const updatedEvent = {
      idHost: req.session.idUser,
      title: title.trim(),
      description: description.trim(),
      eventPicture: `/tmp/img/events/${req.session.username}__${title}.${fileExtension}`,
      realization
    }

    const result = await Event.update(idEvent, updatedEvent);
    if(!result) {
      return res.render("updateEvent", {event:{...req.body, id: event.id}, errors:["A wild error has appeared!"]});
    }
    if(eventPicture) {
      eventPicture.mv(path.join(__dirname, "..", "static", "tmp", "img", "events", `${req.session.username}__${updatedEvent.title}.${fileExtension}`), async err => {
        return res.redirect(`/profile/${req.session.username}`);
      });
    } else {
      return res.redirect(`/profile/${req.session.username}`);
    }
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