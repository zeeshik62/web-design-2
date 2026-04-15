const router = require("express").Router();
const path = require("path");

// Public Views
router.get("/", (req, res) => {
    res.render("halls", { title: "Hall Listings" });
});

router.get("/halls", (req, res) => {
    res.render("halls", { title: "Hall Listings" });
});

router.get("/halls/:slug", (req, res) => {
    res.render("hall-detail", { title: "Hall Details" });
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

module.exports = router;
