const path = require("path");
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const expressLayouts = require("express-ejs-layouts");
// Importando las Variables de Entorno
const { port, secret } = require("./config/.");
const session = require("express-session");

// Importando rutas
const auth = require("./routes/auth");
const profile = require("./routes/profile");
// Importando middlewares
const addSessionToTemplate = require("./middleware/addSessionToTemplate");

const app = express();

// Usando registros con morgan
app.use(morgan("dev"));

// Archivos Estáticos
app.use(express.static(path.join(__dirname, "static")));

// Definiendo middleware layouts
app.use(expressLayouts);
// Usando View Engine
app.set("view engine", "ejs");
app.set("layout", "./layouts/base");
// Redefiniendo la ruta de las vistas
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false
}));
app.use(addSessionToTemplate);

// Middleware para la subida de Archivos
app.use(fileUpload());

// Utilizando rutas
auth(app);
profile(app);

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});