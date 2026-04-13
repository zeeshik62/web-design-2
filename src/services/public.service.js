const HallOwner = require("../models/HallOwner.model");
const SubHall = require("../models/SubHall.model");

class PublicService {
  // Get all hall owners (exclude sensitive data)
  getHallOwners = async (req, res) => {
    try {
      const owners = await HallOwner.find({}, "-password -otp");
      return res.status(200).json({ success: true, data: owners });
    } catch (err) {
      console.error("Public getHallOwners Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get single hall owner by slug
  getHallOwnerBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const owner = await HallOwner.findOne({ slug: slug.toLowerCase() }, "-password -otp");
      
      if (!owner) {
        return res.status(404).json({ success: false, message: "Hall Owner not found" });
      }
      
      return res.status(200).json({ success: true, data: owner });
    } catch (err) {
      console.error("Public getHallOwnerBySlug Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get all subhalls globally
  getSubHalls = async (req, res) => {
    try {
      const subhalls = await SubHall.find().populate("hall_owner_id", "-password -otp");
      return res.status(200).json({ success: true, data: subhalls });
    } catch (err) {
      console.error("Public getSubHalls Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get single subhall strictly by slug
  getSubHallBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const subhall = await SubHall.findOne({ slug: slug.toLowerCase() }).populate("hall_owner_id", "-password -otp");
      
      if (!subhall) {
        return res.status(404).json({ success: false, message: "Subhall not found" });
      }
      
      return res.status(200).json({ success: true, data: subhall });
    } catch (err) {
      console.error("Public getSubHallBySlug Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = new PublicService();
