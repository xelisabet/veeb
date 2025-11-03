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



//@desc relations
//@royte GET /eestifilm/seosed
//@access public
const filmRelations = async (req, res) => {
  let conn;

  const sql = `
    SELECT 
      person.first_name,
      person.last_name,
      movie.title AS movie_title,
      position.position_name,
      person_in_movie.role
    FROM person_in_movie
    JOIN person ON person.id = person_in_movie.person_id
    JOIN movie ON movie.id = person_in_movie.movie_id
    JOIN position ON position.id = person_in_movie.position_id
    ORDER BY person.last_name, movie.title
  `;

  try {
    conn = await mysql.createConnection(dbConf);

    const [rows] = await conn.execute(sql);

    res.render("seosed", { relationsList: rows });

  } catch (err) {
    console.log("Viga andmete lugemisel:", err);

    res.render("seosed", { relationsList: [] });

  } finally {
    if (conn) await conn.end();
  }
};

//@desc add relations
//@royte GET /eestifilm/seosed_add
//@access public
const filmRelationsAdd = async (req, res) => {
  let conn;

  try {
    conn = await mysql.createConnection(dbConf);

    const [persons] = await conn.execute(`
      SELECT id, first_name, last_name 
      FROM person
      ORDER BY last_name
    `);

    const [movies] = await conn.execute(`
      SELECT id, title 
      FROM movie
      ORDER BY title
    `);

    const [positions] = await conn.execute(`
      SELECT id, position_name 
      FROM position
      ORDER BY position_name
    `);

    res.render("seosed_add", {
      notice: "Ootan sisestust!",
      persons,
      movies,
      positions
    });

  } catch (err) {
    console.log("Viga dropdowni andmete laadimisel:", err);

    res.render("seosed_add", {
      notice: "Viga andmete laadimisel!",
      persons: [],
      movies: [],
      positions: []
    });

  } finally {
    if (conn) await conn.end();
  }
};


//@desc save new relation
//@royte POST /eestifilm/seosed_add
//@access public

const filmRelationsAddPost = async (req, res) => {
  let conn;

  const { personSelect, movieSelect, positionSelect, roleInput } = req.body;

  if (!personSelect || !movieSelect || !positionSelect) {
    return res.render("seosed_add", {
      notice: "Palun vali isik, film ja amet!",
      persons: [],
      movies: [],
      positions: []
    });
  }

  try {
    conn = await mysql.createConnection(dbConf);

    const sql = `
      INSERT INTO person_in_movie (position_id, role, person_id, movie_id) 
      VALUES (?, ?, ?, ?)
    `;

    await conn.execute(sql, [
      positionSelect,
      roleInput || null,
      personSelect,
      movieSelect
    ]);

    res.redirect("/eestifilm/seosed");

  } catch (err) {
    console.log("Viga salvestamisel:", err);

    res.render("seosed_add", {
      notice: "Viga salvestamisel!",
      persons: [],
      movies: [],
      positions: []
    });

  } finally {
    if (conn) await conn.end();
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