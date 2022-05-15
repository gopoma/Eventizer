class EventController {
  getCreateEventView(req, res) {
    return res.render("createEvent");
  }

  async createEvent(req, res) {
    console.log(req.files);
    console.log(req.body);
    return res.json({message:"Creating an Event!"});
  }
}

module.exports = EventController;