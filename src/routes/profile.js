const express = require("express");
const ProfileController = require("../controllers/profile");
const verifySession = require("../middleware/verifySession");

function profile(app) {
  const router = express.Router();
  const profileController = new ProfileController();
  
  app.use("/profile", verifySession);
  app.use("/profile", router);

  router.get("/:username", profileController.renderProfile);
  router.get("/update-profile/:username", profileController.getUpdateProfileView);
  router.post("/update-profile/:username", profileController.updateProfile);
}

module.exports = profile;