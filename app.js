const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
//nüüd async jaoks kasutame mysql2 promise osa
//const mysql = require("mysql2/promise");
//const dbInfo = require("../../../vp2025config");

const app = express();
const PORT = 5223;

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

//LOON ANDMEBAASI ÜHENDUSE
/* const conn = mysql.createConnection({ 
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
}); */


/* const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
}; */


//Avaleht 
app.get("/", (req, res) => {
  res.render("index");
});


//Külastuse registreerimise vorm 
app.get("/regvisit", (req, res) => {
  res.render("regvisit");
});


app.post("/regvisit", (req, res) => {
  const firstName = req.body.firstNameInput;
  const lastName = req.body.lastNameInput;


  const now = new Date();
  const dateStr = now.toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const timeStr = now.toLocaleTimeString("et-EE", { hour: "2-digit", minute: "2-digit" });

  const logLine = `${firstName} ${lastName}, ${dateStr} kell ${timeStr}\n`;

  const filePath = path.join(__dirname, "public", "txt", "visitlog.txt");


  fs.appendFile(filePath, logLine, (err) => {
    if (err) {
      console.error("Faili kirjutamisel viga:", err);
      return res.status(500).send("Viga faili kirjutamisel");
    }


    res.render("visitregistered", { firstName: firstName, lastName: lastName });
  });
});


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

//eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(PORT, () => {
  console.log(`Server töötab pordil ${PORT}`);
});
