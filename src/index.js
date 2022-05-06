const path = require("path");
const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
// Importando las Variables de Entorno
const { port } = require("./config/.");

// Importando rutas
const auth = require("./routes/auth");
// Importando middlewares

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

// Utilizando rutas
auth(app);

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});