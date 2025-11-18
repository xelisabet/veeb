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


//@desc Home page that shows last public gallery pictures
//@royte GET /
//@access public
const homePage = async (req, res) => {
  let conn;
  let lastPhoto = null;
  let latestNews = null;
  try{
    conn = await mysql.createConnection(dbConf);
    const sqlReq = `
      SELECT filename, alttext FROM gallerphotos WHERE id = (SELECT MAX(id) FROM gallerphotos WHERE privacy = 3 AND deleted IS NULL)
    `;
    const [rows] = await conn.execute(sqlReq);
    if (rows.length > 0) {
      lastPhoto = rows[0];
    }
     const sqlNews = `
      SELECT title, content, photofilename, alttext, expire 
      FROM news 
      WHERE expire > ? 
      ORDER BY id DESC 
      LIMIT 1
    `;
    const [newsRows] = await conn.execute(sqlNews, [new Date()]);
    if (newsRows.length > 0) latestNews = newsRows[0];
  }catch(err) {
    console.log("Viga foto päringus: ", err);
  }
  finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  } 
  res.render("index", { lastPhoto, latestNews });
};
 

module.exports = {
    homePage};