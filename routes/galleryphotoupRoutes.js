const express = require("express");
const multer = require("multer");
const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

const loginCheck = require("../../../src/checkLogin");
//kõigile marsruutitele lisan siseelogimise kontrolli vahevara
router.use(loginCheck.isLogin);
//kontrollerid
const{
    galleryphotoupPage,
    galleryphotoupPagePost} = require("../controllers/galleryphotoupControllers")

router.route("/").get(galleryphotoupPage);
router.route("/").post(uploader.single("photoInput"), galleryphotoupPagePost);

module.exports = router;

