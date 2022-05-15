const express = require("express");
const EventController = require("../controllers/events");
const verifySession = require("../middleware/verifySession");

function events(app) {
  const router = express.Router();
  const eventController = new EventController();
  
  app.use("/events", verifySession);
  app.use("/events", router);

  router.get("/create-event", eventController.getCreateEventView);
}

module.exports = events;