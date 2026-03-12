const router = require("express").Router();
const hallServices = require("../services/hall.service");

router.get("/get_halls", hallServices.listHalls);
// router.post("/login", authServices.login);

module.exports = router;