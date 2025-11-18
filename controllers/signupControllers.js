const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: dbInfo.configData.dataBase
};


//@desc Home page for creating user account
//@royte GET /signup
//@access public
const signupPage = async (req, res)=>{
  res.render("signup", {notice: "Ootan andmeid!"});
};


//@desc page for creating user account
//@royte POST /signup
//@access public
const signupPagePost = async (req, res) => {
  let conn;
  console.log(req.body);
  //andmete algne valideerimine
  if(
    !req.body.firstNameInput || 
    !req.body.lastNameInput ||
    !req.body.birthDateInput ||
    !req.body.genderInput ||
    !req.body.emailInput ||
    req.body.passwordInput.length < 8 ||
    req.body.passwordInput !== req.body.confirmPasswordInput
  ) {
    let notice = "Andmed puudu või need on vigased!";
    console.log(notice);
    return res.render("signup", {notice: notice})
  }
  try{
    //krüpteerime salasõna
    const pwdHash = await argon2.hash(req.body.passwordInput);

    conn = await mysql.createConnection(dbConf);
    let sqlReq = "INSERT INTO usersid (first_name, last_name, birth_date, gender, email, password) VALUES(?,?,?,?,?,?)";
    const [result] = await conn.execute(sqlReq, [req.body.firstNameInput,
    req.body.lastNameInput,
    req.body.birthDateInput,
    req.body.genderInput,
    req.body.emailInput,
    pwdHash])
    res.render("signup", {notice: "Konto loodud!"});
  }catch(err) {
    console.log(err);
    res.render("signup", {notice: "Tehniline viga"});
  }
  finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasi ühendus suletud");
    }
  } 
};


module.exports = {
    signupPage,
    signupPagePost};