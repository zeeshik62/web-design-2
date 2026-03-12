const router = require("express").Router();
const enquiryServices = require("../services/enquiry.service");

router.get("/get_enquiry", enquiryServices.listEnquiries);

module.exports = router;