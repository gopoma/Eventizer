class EventController {
  getCreateEventView(req, res) {
    return res.render("createEvent");
  }
}

module.exports = EventController;