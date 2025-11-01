const express = require("express");
const router = express.Router();

//kontrollerid
const{
    visitLog,
    visitAdd,
    visitAddPost} = require("../controllers/visitControllers")

router.route("/visitlog").get(visitLog);
router.route("/regvisit").get(visitAdd);
router.route("/regvisit").post(visitAddPost);

module.exports = router;
