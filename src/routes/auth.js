const express = require("express");

function auth(app) {
  const router = express.Router();
  app.use("/auth", router);

  router.get("/login", (req, res) => {
    return res.end("Sending the login view");
  });
  router.get("/signup", (req, res) => {
    return res.end("Sending the signup view");
  });
}

module.exports = auth;