const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const config = {
  port: process.env.PORT
};

module.exports = config;