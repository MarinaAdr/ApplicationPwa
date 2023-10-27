const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ejs = require("ejs");
const session = require("express-session");

const app = express();
const port = 3001;

// Configuration de la base de données MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "express",
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});

// Configuration du moteur de template EJS
app.set("view engine", "ejs");

// Configurer le dossier "public" pour servir des fichiers statiques
app.use(express.static("public"));

// Configuration du middleware body-parser pour les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration du middleware express-session
app.use(
  session({
    secret: "votre_clé_secrète",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/index", (req, res) => {
  res.render("index");
});

// Route pour afficher le formulaire de connexion
app.get("/", (req, res) => {
  res.render("auth", { message: null }); // Ajoutez { message: null } pour définir la variable `message`
});

// Route pour traiter la connexion
app.post("/login", (req, res) => {
  const { login, password } = req.body;
  connection.query(
    "SELECT * FROM admin WHERE login = ? AND pass = ?",
    [login, password],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect("/index");
      } else {
        res.redirect("/");
      }
    }
  );
});

// Route pour afficher le formulaire d'inscription
app.get("/register", (req, res) => {
  res.render("inscription", { message: null });
});

// Route pour traiter l'inscription
app.post("/register", (req, res) => {
  const { login, password } = req.body;
  const admin = { login, pass: password }; // Utilisation de "pass" au lieu de "password"
  connection.query("INSERT INTO admin SET ?", admin, (err, result) => {
    // Utilisation de "admin" au lieu de "admins"
    if (err) throw err;
    res.redirect("/");
  });
});

// Route pour la déconnexion
app.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
