const express = require("express");
const router = express.Router();
const loginCheck = require("../../../src/checkLogin");
//kõigile marsruutitele lisan siseelogimise kontrolli vahevara
router.use(loginCheck.isLogin);

//kontrollerid
const{
    photogalleryHome,
    photogalleryPage} = require("../controllers/photogalleryControllers")

router.route("/").get(photogalleryHome);

router.route("/:page").get(photogalleryPage);

module.exports = router;

