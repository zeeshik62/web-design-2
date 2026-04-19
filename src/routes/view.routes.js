const router = require("express").Router();
const path = require("path");

// Public Views
router.get("/", (req, res) => {
    res.render("home", { title: "Welcome" });
});

router.get("/halls", (req, res) => {
    res.render("halls", { title: "Hall Listings" });
});

router.get("/halls/:slug", (req, res) => {
    res.render("hall-detail", { title: "Hall Details" });
});

router.get("/vendors", (req, res) => {
    res.render("vendors", { title: "Vendor Listings" });
});

router.get("/vendors/:slug", (req, res) => {
    res.render("vendor-detail", { title: "Vendor Details" });
});

router.get("/login", (req, res) => {
    res.render("login", { title: "User Login" });
});

router.get("/register", (req, res) => {
    res.render("register", { title: "User Registration" });
});

// Owner Portal Views
router.get("/owner/login", (req, res) => {
    res.render("owner/login", { title: "Owner Login" });
});

router.get("/owner/register", (req, res) => {
    res.render("owner/register", { title: "Owner Registration" });
});

router.get("/owner/forgot-password", (req, res) => {
    res.render("owner/forgot-password", { title: "Forgot Password" });
});

router.get("/owner/reset-password", (req, res) => {
    res.render("owner/reset-password", { title: "Reset Password" });
});

router.get("/owner/dashboard", (req, res) => {
    res.render("owner/dashboard", { title: "Owner Dashboard" });
});

router.get("/owner/halls", (req, res) => {
    res.render("owner/halls", { title: "Manage My Halls" });
});

router.get("/owner/add-hall", (req, res) => {
    res.render("owner/add-hall", { title: "Add New Hall" });
});

router.get("/owner/edit-hall/:id", (req, res) => {
    res.render("owner/edit-hall", { title: "Edit Hall" });
});

router.get("/owner/queries", (req, res) => {
    res.render("owner/queries", { title: "Manage Enquiries" });
});

router.get("/owner/customers", (req, res) => {
    res.render("owner/customers", { title: "My Customers" });
});

router.get("/owner/profile", (req, res) => {
    res.render("owner/profile", { title: "My Profile" });
});

router.get("/owner/vendors", (req, res) => {
    res.render("owner/vendors", { title: "Manage Vendor Services" });
});

router.get("/owner/add-vendor", (req, res) => {
    res.render("owner/add-vendor", { title: "Add Vendor Service" });
});

router.get("/owner/edit-vendor/:id", (req, res) => {
    res.render("owner/edit-vendor", { title: "Edit Vendor Service" });
});

module.exports = router;
