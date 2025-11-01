const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
};


//@desc Home page for Estonian film section
//@royte GET /visitlog
//@access public
const visitLog = async (req, res)=>{
  let conn;
  const filePath = path.join(__dirname, "public", "txt", "visitlog.txt");
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");
    const [rows, fields] = await conn.execute(sqlReq);
    res.render("eestifilm", {movie: rows});
  }
  catch(err) {
    console.error("Logifaili lugemisel viga:", err);
    return res.render("visitlog", { visits: [] });
  }
  finally {
    if(conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};
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

//@desc page for adding people involved in Estonian film industry
//@royte GET /eestifilm/film_add
//@access public
const filmAdd = (req, res)=>{
  res.render("film_add", {notice: "Ootan siestust!"});
};


//@desc page for adding people involved in Estonian film industry
//@royte POST /eestifilm/film_add
//@access public
const filmAddPost = async (req, res) => {
  let conn;
  const sqlReq = "INSERT INTO movie (title, production_ye, duration, description) VALUES (?,?,?,?)";

  // kas andmed on olemas
  if (!req.body.titleInput || !req.body.production_yeInput || req.body.durationInput || req.body.descriptionInput) {
    res.render("film_add", { notice: "Andmed on vigased! Vaata üle!" });
    return;
  }

  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");

    const [result] = await conn.execute(sqlReq, [
      req.body.titleInput,
      req.body.production_yeInput,
      req.body.durationInput,
      req.body.descriptionInput
    ]);

    console.log("Salvestati kirje id: " + result.insertId);
    res.render("film_add", { notice: "Andmed on salvestatud!" });
  } catch (err) {
    console.log("Viga: " + err);
    res.render("film_add", { notice: "Tekkis tehniline viga! " + err });
  } finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};
module.exports = {
    visitLog,
    visitAdd,
    visitAddPost};