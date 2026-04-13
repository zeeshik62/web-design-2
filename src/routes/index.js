// src/routes/index.js
const router = require("express").Router();

const authRoutes = require("./auth.routes");
const hallRoutes = require("./hall.routes");
const hallOwnerRoutes = require("./hall_owner.routes");
const customerRoutes = require("./customer.routes");
const publicRoutes = require("./public.routes");

router.use("/auth", authRoutes);
router.use("/halls", hallRoutes);
router.use("/hall_owner", hallOwnerRoutes);
router.use("/customer", customerRoutes);
router.use("/public", publicRoutes);

module.exports = router;