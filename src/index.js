const express = require("express");
const { port } = require("./config/.");
const auth = require("./routes/auth");

const app = express();

auth(app);

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});