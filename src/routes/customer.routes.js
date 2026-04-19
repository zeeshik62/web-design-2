const router = require("express").Router();
const customerController = require("../services/customer.service");
const vendorQueryService = require("../services/vendor_query.service");
const authMiddleware = require("../middlewares/auth.middleware");

// Customer Authentication
router.post("/auth/register", customerController.register);
router.post("/auth/login", customerController.login);

// Customer Hall Queries (Protected)
router.post("/queries", authMiddleware, customerController.submitQuery);

// Customer Vendor Queries (Protected)
router.post("/vendor-queries", authMiddleware, vendorQueryService.submitVendorQuery);

router.get("/get_customers", customerController.listCustomers);

module.exports = router;