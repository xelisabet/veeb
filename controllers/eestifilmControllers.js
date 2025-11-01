const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
};


//@desc Home page for Estonian film section
//@royte GET /eestifilm
//@access public
const filmHomePage = async (req, res)=>{
  let conn;
  const sqlReq = "SELECT * FROM movie";
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");
    const [rows, fields] = await conn.execute(sqlReq);
    res.render("eestifilm", {movie: rows});
  }
  catch(err) {
    console.log("Viga: " + err);
    res.render("eestifilm", {movie: []});
  }
  finally {
    if(conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};

//@desc page for adding Estonian films
//@royte GET /eestifilm/film_add
//@access public
const filmAdd = (req, res)=>{
  res.render("film_add", {notice: "Ootan siestust!"});
};


//@desc page for adding Estonian films
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



//@desc page for list of people involved in Estonian film industry
//@royte GET /eestifilm/eestifilmiinimesed
//@access public
const filmPeople = async (req, res)=>{
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
};


//@desc page for adding people involved in Estonian film industry
//@royte GET /eestifilm/eestifilmiinimesed_add
//@access public
const filmPeopleAdd = (req, res)=>{
  res.render("eestifilmiinimesed_add", {notice: "Ootan siestust!"});
};


//@desc page for adding people involved in Estonian film industry
//@royte POST /eestifilm/eestifilmiinimesed_add
//@access public
const filmPeopleAddPost = async (req, res) => {
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
};


//@desc page for list of positions involved Estonian film industry
//@royte GET /eestifilm/positions
//@access public
const filmPosition = async (req, res)=>{
  let conn;
  const sqlReq = "SELECT * FROM position";
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");
    const [rows, fields] = await conn.execute(sqlReq);
    res.render("positions", {positions: rows});
  }
  catch(err) {
    console.log("Viga: " + err);
    res.render("positions", {positions: []});
  }
  finally {
    if(conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};

//@desc page for list of positions involved in Estonian film industry
//@royte GET /eestifilm/position_add
//@access public
const filmPositionAdd = (req, res) => {
  res.render("position_add", { notice: "Ootan sisestust!" });
};


//@desc page for list of positions involved in Estonian film industry
//@royte POST /eestifilm/position_add
//@access public
const filmPositionAddPost = async (req, res) => {
  let conn;
  const sqlReq = "INSERT INTO position (position_name, description) VALUES (?,?)";

  // kas andmed on olemas
  if (!req.body.positionNameInput || !req.body.positionDescriptionInput) {
    res.render("position_add", { notice: "Andmed on vigased! Vaata üle!" });
    return;
  }

  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");

    const [result] = await conn.execute(sqlReq, [
      req.body.positionNameInput,
      req.body.positionDescriptionInput,
    ]);

    console.log("Salvestati kirje id: " + result.insertId);
    res.render("position_add", { notice: "Andmed on salvestatud!" });
  } catch (err) {
    console.log("Viga: " + err);
    res.render("position_add", { notice: "Tekkis tehniline viga! " + err });
  } finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};



//@desc page for list of relations in Estonian film industry
//@royte GET /eestifilm/seosed
//@access public
const filmRelations = async (req, res)=>{
  let conn;
  const sqlReq = "SELECT * FROM person_in_movie";
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");
    const [rows, fields] = await conn.execute(sqlReq);
    res.render("seosed", {relationsList: rows});
  }
  catch(err) {
    console.log("Viga: " + err);
    res.render("seosed", {relationsList: []});
  }
  finally {
    if(conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};

//@desc page for list of relations in Estonian film industry
//@royte GET /eestifilm/seosed_add
//@access public
const filmRelationsAdd = (req, res) => {
  res.render("seosed_add", { notice: "Ootan sisestust!" });
};


//@desc page for list of relations in Estonian film industry
//@royte POST /eestifilm/seosed_add
//@access public
const filmRelationsAddPost = async (req, res) => {
  let conn;
  const sqlReq = "INSERT INTO person_in_movie (position_id, role, person_id, movie_id) VALUES (?,?,?,?)";

  // kas andmed on olemas
  if (!req.body.position_idInput || !req.body.roleInput || !req.body.person_idInput || !req.body.movie_idInput) {
    res.render("seosed_add", { notice: "Andmed on vigased! Vaata üle!" });
    return;
  }

  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud");

    const [result] = await conn.execute(sqlReq, [
      req.body.position_idInput,
      req.body.roleInput,
      req.body.person_idInput,
      req.body.movie_idInput,
    ]);

    console.log("Salvestati kirje id: " + result.insertId);
    res.render("seosed_add", { notice: "Andmed on salvestatud!" });
  } catch (err) {
    console.log("Viga: " + err);
    res.render("seosed_add", { notice: "Tekkis tehniline viga! " + err });
  } finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  }
};

module.exports = {
    filmHomePage,
    filmAdd,
    filmAddPost,
    filmPeople,
    filmPeopleAdd,
    filmPeopleAddPost,
    filmPosition,
    filmPositionAdd,
    filmPositionAddPost,
    filmRelations,
    filmRelationsAdd,
    filmRelationsAddPost};