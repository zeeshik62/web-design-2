const router = require("express").Router();
const customerController = require("../services/customer.service");
const authMiddleware = require("../middlewares/auth.middleware");

// Customer Authentication
router.post("/auth/register", customerController.register);
router.post("/auth/login", customerController.login);

// Customer Queries (Protected)
router.post("/queries", authMiddleware, customerController.submitQuery);

router.get("/get_customers", customerController.listCustomers);

module.exports = router;