const router = require("express").Router();
const customerController = require("../services/customer.service");

router.get("/get_customers", customerController.listCustomers);

// router.get("/customers/:id", customerService.getCustomerById);

// router.get("/customers/by-customer-id/:customer_id", customerService.getCustomerByCustomerId);

module.exports = router;