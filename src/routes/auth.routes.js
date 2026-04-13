const router = require("express").Router();
const authServices = require("../services/auth.service");

router.post("/register", authServices.register);
router.post("/login", authServices.login);
router.post("/forgot-password", authServices.forgotPassword);
router.post("/reset-password", authServices.resetPassword);

module.exports = router;