const router = require("express").Router();
const enquiryService = require("../services/enquiry.service");
const customerService = require("../services/customer.service");
const subHallService = require("../services/subhall.service");
const hallOwnerService = require("../services/hall_owner.service");
const formQueryService = require("../services/form_query.service");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes (if any are specifically intended inside here)
router.get("/get_enquiry", enquiryService.listEnquiries);
router.post("/query", formQueryService.submitQuery);

// Mount Authentication Middleware
router.use(authMiddleware);

// Hall Owner Form Queries
router.get("/queries-form", formQueryService.getQueries);
router.patch("/query-form/:id/status", formQueryService.updateStatus);
router.delete("/query-form/:id", formQueryService.deleteQuery);

// Hall Owner Enquiries (User Queries)
router.get("/enquiries", enquiryService.getOwnerEnquiries);
router.patch("/enquiries/:id/status", enquiryService.updateEnquiryStatus);

// Hall Owner Related Customers
router.get("/customers", customerService.getRelatedCustomers);

// Hall Owner Profile Routes
router.get("/stats", hallOwnerService.getDashboardStats);
router.put("/profile", hallOwnerService.updateProfile);
router.patch("/profile/toggle-public", hallOwnerService.toggleIsPublic);

// SubHall Routes
router.post("/subhalls", subHallService.createSubHall);
router.get("/subhalls", subHallService.getSubHalls);
router.get("/subhalls/:id", subHallService.getSubHallById);
router.put("/subhalls/:id", subHallService.updateSubHall);
router.delete("/subhalls/:id", subHallService.deleteSubHall);
router.patch("/subhalls/:id/toggle-public", subHallService.toggleIsPublic);

module.exports = router;