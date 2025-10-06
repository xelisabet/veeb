const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5223; // vali oma port, näiteks 5223

// Staatiliste failide ja piltide jaoks
app.use(express.static("public"));

// View engine EJS
app.set("view engine", "ejs");

// Body parser POST-vormide jaoks
app.use(bodyParser.urlencoded({ extended: false }));

// --- Avaleht ---
app.get("/", (req, res) => {
  res.render("index");
});

// --- Külastuse registreerimise vorm ---
app.get("/regvisit", (req, res) => {
  res.render("regvisit");
});

// --- Vormist saadud andmete töötlemine ---
app.post("/regvisit", (req, res) => {
  const firstName = req.body.firstNameInput;
  const lastName = req.body.lastNameInput;

  // Koostame kuupäeva ja kellaaja
  const now = new Date();
  const dateStr = now.toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const timeStr = now.toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" });

  // Koostame logirea
  const logLine = `${firstName} ${lastName}, ${dateStr} kell ${timeStr}\n`;

  // Faili tee
  const filePath = path.join(__dirname, "public", "txt", "visitlog.txt");

  // Kirjutame faili (loob faili kui seda veel pole)
  fs.appendFile(filePath, logLine, (err) => {
    if (err) {
      console.error("Faili kirjutamisel viga:", err);
      return res.status(500).send("Viga faili kirjutamisel");
    }

    // Näitame salvestuse kinnitust eraldi lehel
    res.render("visitregistered", { firstName: firstName, lastName: lastName });
  });
});

// --- Külastuste logi vaatamine ---
app.get("/visitlog", (req, res) => {
  const filePath = path.join(__dirname, "public", "txt", "visitlog.txt");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Logifaili lugemisel viga:", err);
      return res.render("visitlog", { visits: [] });
    }

    const visits = data.split("\n").filter(line => line.trim() !== "");
    res.render("visitlog", { visits: visits });
  });
});

// --- Serveri käivitamine ---
app.listen(PORT, () => {
  console.log(`Server töötab pordil ${PORT}`);
});
