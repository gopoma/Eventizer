const express = require("express");
const EventController = require("../controllers/events");
const verifySession = require("../middleware/verifySession");

function events(app) {
  const router = express.Router();
  const eventController = new EventController();
  
  app.use("/events", verifySession);
  app.use("/events", router);

  router.get("/", eventController.renderEvents);
  router.get("/view-details/:idEvent", eventController.renderEventDetails);
  router.get("/create-event", eventController.getCreateEventView);
  router.post("/create-event", eventController.createEvent);
  router.get("/:idEvent/addGuest", eventController.addGuest);
  router.get("/update-event/:idEvent", eventController.getUpdateEventView);
  router.post("/update-event/:idEvent", eventController.updateEvent);
  router.get("/delete-event/:idEvent", eventController.getDeleteEventView);
  router.post("/delete-event/:idEvent", eventController.deleteEvent);
}

module.exports = events;