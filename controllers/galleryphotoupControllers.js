const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
};


//@desc Home page for uploading gallery pictures
//@royte GET /galleryphotoupload
//@access public
const galleryphotoupPage = async (req, res)=>{
  res.render("galleryupload");
};


//@desc page for uploading gallery pictures
//@royte POST /galleryphotoupload
//@access public
const galleryphotoupPagePost = async (req, res) => {
  let conn;
  console.log(req.body);
  console.log(req.file);

  try{
    const fileName = "vp_" + Date.now() + ".jpg";
    console.log(fileName);
    await fs.rename(req.file.path, req.file.destination + fileName);
    await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
    await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
    let sqlReq = "INSERT INTO gallerphotos (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
    //kuna kasutaja kontosid veel pole, siis kasutaja 1
    const userId = 1;
    conn = await mysql.createConnection(dbConf);
    const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
    res.render("galleryupload");
  }catch(err) {
    console.log(err);
    res.render("galleryupload");
  }
  finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  } 
};
  /* const sqlReq = "INSERT INTO movie (title, production_ye, duration, description) VALUES (?,?,?,?)";

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
}; */

module.exports = {
    galleryphotoupPage,
    galleryphotoupPagePost};