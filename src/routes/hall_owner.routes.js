const router = require("express").Router();
const enquiryService = require("../services/enquiry.service");
const customerService = require("../services/customer.service");
const subHallService = require("../services/subhall.service");
const vendorService = require("../services/vendor.service");
const hallOwnerService = require("../services/hall_owner.service");
const formQueryService = require("../services/form_query.service");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

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
router.get("/profile", hallOwnerService.getProfile);
router.put("/profile", hallOwnerService.updateProfile);
router.patch("/profile/toggle-public", hallOwnerService.toggleIsPublic);

// SubHall Routes
router.post("/subhalls", subHallService.createSubHall);
router.get("/subhalls", subHallService.getSubHalls);
router.get("/subhalls/:id", subHallService.getSubHallById);
router.put("/subhalls/:id", subHallService.updateSubHall);
router.delete("/subhalls/:id", subHallService.deleteSubHall);
router.patch("/subhalls/:id/toggle-public", subHallService.toggleIsPublic);

// Vendor Routes
router.post("/vendors", vendorService.createVendor);
router.get("/vendors", vendorService.getVendors);
router.get("/vendors/:id", vendorService.getVendorById);
router.put("/vendors/:id", vendorService.updateVendor);
router.delete("/vendors/:id", vendorService.deleteVendor);
router.patch("/vendors/:id/toggle-public", vendorService.toggleIsPublic);

// File Upload Route
router.post("/upload/:type", uploadMiddleware.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    
    const type = req.params.type;
    // Construct the public URL path since "public" is exposed as static directory
    const imagePath = `/uploads/${type}/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        path: imagePath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;