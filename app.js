const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
//nüüd async jaoks kasutame mysql2 promise osa
const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

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


const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
};


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


app.get("/eestifilm", (req, res) => {
  res.render("eestifilm");
});


app.get("/eestifilmiinimesed", async (req, res)=>{
  let conn;
  const sqlReq = "SELECT * FROM person";
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");
    const [rows, fields] = await conn.execute(sqlReq);
    res.render("eestifilmiinimesed", {personList: rows});
  }
  catch(err) {
    console.log("Viga: " + err);
    res.render("eestifilmiinimesed", {personList: []});
  }
  finally {
    if(conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
});


app.get("/eestifilmiinimesed_add", (req, res)=>{
  res.render("eestifilmiinimesed_add", {notice: "Ootan siestust!"});
});

app.post("/eestifilmiinimesed_add", async (req, res) => {
  let conn;
  const sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";

  // kas andmed on olemas
  if (!req.body.firstNameInput || !req.body.lastNameInput || req.body.bornInput > new Date()) {
    res.render("eestifilmiinimesed_add", { notice: "Andmed on vigased! Vaata üle!" });
    return;
  }

  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");

    let deceasedDate = null;
    if (req.body.deceasedInput !== "") {
      deceasedDate = req.body.deceasedInput;
    }

    const [result] = await conn.execute(sqlReq, [
      req.body.firstNameInput,
      req.body.lastNameInput,
      req.body.bornInput,
      deceasedDate
    ]);

    console.log("Salvestati kirje id: " + result.insertId);
    res.render("eestifilmiinimesed_add", { notice: "Andmed on salvestatud!" });
  } catch (err) {
    console.log("Viga: " + err);
    res.render("eestifilmiinimesed_add", { notice: "Tekkis tehniline viga! " + err });
  } finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
});




app.get("/positions", (req, res) => {
  const sqlReq = "SELECT * FROM position";
  conn.execute(sqlReq, (err, sqlRes) => {
    if (err) {
      console.error("Viga andmebaasi lugemisel:", err);
      res.render("positions", { positions: [] });
    } else {
      res.render("positions", { positions: sqlRes });
    }
  });
});


app.get("/position_add", (req, res) => {
  res.render("position_add", { notice: "" });
});


app.post("/position_add", (req, res) => {
  const name = req.body.positionNameInput;
  const description = req.body.positionDescriptionInput;

  if (!name || !description) {
    return res.render("position_add", { notice: "Täida kõik väljad!" });
  }

  const sqlReq = "INSERT INTO position (position_name, description) VALUES (?, ?)";
  conn.execute(sqlReq, [name, description], (err) => {
    if (err) {
      console.error("Viga salvestamisel:", err);
      res.render("position_add", { notice: "Viga salvestamisel!" });
    } else {
      
      res.redirect("/eestifilm/ametid");
    }
  });
});

app.get("/positions", (req, res) => {
  const sqlReq = "SELECT * FROM position";
  conn.execute(sqlReq, (err, sqlRes) => {
    if (err) {
      console.log(err);
      res.render("positions", { positions: [] });
    } else {
      res.render("positions", { positions: sqlRes });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server töötab pordil ${PORT}`);
});
