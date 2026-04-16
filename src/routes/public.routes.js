const router = require("express").Router();
const publicService = require("../services/public.service");

// Hall Owners Endpoints
router.get("/hall-owners", publicService.getHallOwners);
router.get("/hall-owners/:slug", publicService.getHallOwnerBySlug);

// SubHalls Endpoints 
router.get("/hall-owners/:owner_id/subhalls", publicService.getSubHallsByOwnerId);
router.get("/subhalls", publicService.getSubHalls);
router.get("/subhalls/:slug", publicService.getSubHallBySlug);

module.exports = router;
