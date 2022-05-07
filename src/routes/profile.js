const express = require("express");
const ProfileController = require("../controllers/profile");

function profile(app) {
  const router = express.Router();
  const profileController = new ProfileController();
  
  app.use("/profile", router);

  router.get("/:username", profileController.renderProfile);
}

module.exports = profile;