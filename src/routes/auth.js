const express = require("express");
const AuthController = require("../controllers/auth");

function auth(app) {
  const router = express.Router();
  const authController = new AuthController();
  app.use("/auth", router);

  router.get("/login", authController.getLoginView);
  router.get("/signup", authController.getSignUpView);
  router.post("/signup", authController.signUp);
}

module.exports = auth;