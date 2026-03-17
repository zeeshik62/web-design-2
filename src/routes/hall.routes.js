const router = require("express").Router();
const hallController  = require("../services/hall.service");

router.get("/get_halls", hallController.listHalls);
// router.post("/login", authServices.login);

module.exports = router;