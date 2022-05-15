const express = require("express");
const AuthController = require("../controllers/auth");
const verifyNoSession = require("../middleware/verifyNoSession");

function auth(app) {
  const router = express.Router();
  const authController = new AuthController();

  app.use("/auth", router);

  router.get("/login", verifyNoSession, authController.getLoginView);
  router.post("/login", verifyNoSession, authController.logIn);
  router.get("/signup", verifyNoSession, authController.getSignUpView);
  router.post("/signup", verifyNoSession, authController.signUp);
  router.get("/logout", authController.logOut);
}

module.exports = auth;