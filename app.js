const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
// sessiooni haldur
const session =require("express-session");
//nüüd async jaoks kasutame mysql2 promise osa
//const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");
const loginCheck = require("../../src/checkLogin");
const {isLogin} = require("../../src/checkLogin");
const app = express();
const PORT = 5223;

app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");
//kui vormist tuleb ainult text siis false, muidu true
app.use(bodyParser.urlencoded({ extended: false }));



//sisseloginud kasutajate avaleht
app.get("/home", loginCheck.isLogin, (req,res)=>{
  //console.log("Sisse logis kasutaja id: " + req.session.userId);
  res.render("home", {userName: req.session.userFirstName + " " + req.session.userLastName});
})

//välja logimine
app.get("/logout", (req,res)=>{
  console.log("Kasutaja id: " + req.session.userId + " logis välja");
  //tühistame sessiooni
  req.session.destroy();
  res.redirect("/");
})

//avalehe marsruut
const homeRouter = require("./routes/homeRoutes");
app.use("/", homeRouter);

//regamise marsruut
const visitRouter = require("./routes/visitRoutes");
app.use("/", visitRouter);

//eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

//galeriipiltide üleslaadimise marsruudid
const galleryphotoupRouter = require("./routes/galleryphotoupRoutes");
app.use("/galleryphotoupload", galleryphotoupRouter);

//galerii marsruudid
const photogalleryRouter = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRouter);

//uudiste marsruut
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);

//konto loomise marsruut
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

//kontosse sisse lobimise marsruut
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(PORT, () => {
  console.log(`Server töötab pordil ${PORT}`);
});
