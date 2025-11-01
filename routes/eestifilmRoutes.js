const express = require("express");
const router = express.Router();

//kontrollerid
const{
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
    filmRelationsAddPost} = require("../controllers/eestifilmControllers")

router.route("/").get(filmHomePage);
router.route("/film_add").get(filmAdd);
router.route("/film_add").post(filmAddPost);

router.route("/inimesed").get(filmPeople);
router.route("/inimesed_add").get(filmPeopleAdd);
router.route("/inimesed_add").post(filmPeopleAddPost);

router.route("/positions").get(filmPosition);
router.route("/position_add").get(filmPositionAdd);
router.route("/position_add").post(filmPositionAddPost);

router.route("/seosed").get(filmRelations);
router.route("/seosed_add").get(filmRelationsAdd);
router.route("/seosed_add").post(filmRelationsAddPost);

module.exports = router;

