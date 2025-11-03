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


//regamise marsruut
const visitRouter = require("./routes/visitRoutes");
app.use("/", visitRouter);

//eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(PORT, () => {
  console.log(`Server töötab pordil ${PORT}`);
});
