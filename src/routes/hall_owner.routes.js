const router = require("express").Router();
const enquiryController = require("../services/enquiry.service");

router.get("/get_enquiry", enquiryController.listEnquiries);

module.exports = router;