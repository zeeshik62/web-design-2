const router = require("express").Router();
const enquiryController = require("../services/enquiry.service");
const subHallService = require("../services/subhall.service");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes (if any are specifically intended inside here)
router.get("/get_enquiry", enquiryController.listEnquiries);

// Mount Authentication Middleware
router.use(authMiddleware);

// SubHall Routes
router.post("/subhalls", subHallService.createSubHall);
router.get("/subhalls", subHallService.getSubHalls);
router.get("/subhalls/:id", subHallService.getSubHallById);
router.put("/subhalls/:id", subHallService.updateSubHall);
router.delete("/subhalls/:id", subHallService.deleteSubHall);

module.exports = router;