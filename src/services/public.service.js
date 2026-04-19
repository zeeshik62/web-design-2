const HallOwner = require("../models/HallOwner.model");
const SubHall = require("../models/SubHall.model");
const Vendor = require("../models/Vendor.model");

class PublicService {
  // Get all hall owners (exclude sensitive data)
  getHallOwners = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const { search, city, street } = req.query;
      const filter = { is_public: true, is_verified: true };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand_name: { $regex: search, $options: 'i' } }
        ];
      }
      if (city) filter['address.city'] = { $regex: city, $options: 'i' };
      if (street) filter['address.street_address'] = { $regex: street, $options: 'i' };

      const owners = await HallOwner.find(filter, "-password -otp")
        .skip(skip)
        .limit(limit);
      const total = await HallOwner.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: owners,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Public getHallOwners Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get single hall owner by slug
  getHallOwnerBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const owner = await HallOwner.findOne({
        slug: slug.toLowerCase(),
        is_public: true,
        is_verified: true
      }, "-password -otp");

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
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      // Pre-fetch valid public/verified Hall Owner IDs to restrict SubHalls globally
      const validOwners = await HallOwner.find({ is_public: true, is_verified: true }).select('_id').lean();
      const validOwnerIds = validOwners.map(owner => owner._id);

      const { search, city, street, type, has_discount, min_price, max_price } = req.query;
      const filter = {
        is_public: true,
        hall_owner_id: { $in: validOwnerIds }
      };

      if (search) filter.subhall_name = { $regex: search, $options: 'i' };
      if (city) filter['address.city'] = { $regex: city, $options: 'i' };
      if (street) filter['address.street_address'] = { $regex: street, $options: 'i' };
      if (type) filter.type = type;

      if (has_discount === 'true') {
        filter.discount = { $ne: null };
      } else if (has_discount === 'false') {
        filter.discount = null;
      }

      if (min_price || max_price) {
        filter.starting_price = {};
        if (min_price) filter.starting_price.$gte = Number(min_price);
        if (max_price) filter.starting_price.$lte = Number(max_price);
      }

      const subhalls = await SubHall.find(filter)
        .populate("hall_owner_id", "-password -otp")
        .skip(skip)
        .limit(limit);
      const total = await SubHall.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: subhalls,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Public getSubHalls Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get single subhall strictly by slug
  getSubHallBySlug = async (req, res) => {
    try {
      const { slug } = req.params;

      const validOwners = await HallOwner.find({ is_public: true, is_verified: true }).select('_id').lean();
      const validOwnerIds = validOwners.map(owner => owner._id);

      const subhall = await SubHall.findOne({
        slug: slug.toLowerCase(),
        is_public: true,
        hall_owner_id: { $in: validOwnerIds }
      }).populate("hall_owner_id", "-password -otp");

      if (!subhall) {
        return res.status(404).json({ success: false, message: "Subhall not found" });
      }

      return res.status(200).json({ success: true, data: subhall });
    } catch (err) {
      console.error("Public getSubHallBySlug Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get all public subhalls for a specific hall owner
  getSubHallsByOwnerId = async (req, res) => {
    try {
      const { owner_id } = req.params;

      // Ensure the directly requested owner is verified and public
      const ownerCheck = await HallOwner.findOne({ _id: owner_id, is_public: true, is_verified: true }).select('_id').lean();
      if (!ownerCheck) {
        return res.status(404).json({ success: false, message: "Hall Owner not found, private, or unverified" });
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const { search, city, street, type, has_discount, min_price, max_price } = req.query;
      const filter = { hall_owner_id: owner_id, is_public: true };

      if (search) filter.subhall_name = { $regex: search, $options: 'i' };
      if (city) filter['address.city'] = { $regex: city, $options: 'i' };
      if (street) filter['address.street_address'] = { $regex: street, $options: 'i' };
      if (type) filter.type = type;

      if (has_discount === 'true') {
        filter.discount = { $ne: null };
      } else if (has_discount === 'false') {
        filter.discount = null;
      }

      if (min_price || max_price) {
        filter.starting_price = {};
        if (min_price) filter.starting_price.$gte = Number(min_price);
        if (max_price) filter.starting_price.$lte = Number(max_price);
      }

      const subhalls = await SubHall.find(filter)
        .populate("hall_owner_id", "-password -otp")
        .skip(skip)
        .limit(limit);

      const total = await SubHall.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: subhalls,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Public getSubHallsByOwnerId Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get all vendors globally
  getVendors = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      // Pre-fetch valid public/verified Hall Owner IDs to restrict Vendors globally
      const validOwners = await HallOwner.find({ is_public: true, is_verified: true }).select('_id').lean();
      const validOwnerIds = validOwners.map(owner => owner._id);

      const { search, city, street, category, has_discount, min_price, max_price } = req.query;
      const filter = {
        is_public: true,
        vendor_id: { $in: validOwnerIds }
      };

      if (search) filter.vendor_name = { $regex: search, $options: 'i' };
      if (city) filter['address.city'] = { $regex: city, $options: 'i' };
      if (street) filter['address.street_address'] = { $regex: street, $options: 'i' };
      if (category) filter.category = category;

      if (has_discount === 'true') {
        filter.discount = { $ne: null };
      } else if (has_discount === 'false') {
        filter.discount = null;
      }

      if (min_price || max_price) {
        filter.starting_price = {};
        if (min_price) filter.starting_price.$gte = Number(min_price);
        if (max_price) filter.starting_price.$lte = Number(max_price);
      }

      const vendors = await Vendor.find(filter)
        .populate("vendor_id", "-password -otp")
        .skip(skip)
        .limit(limit);
      const total = await Vendor.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: vendors,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Public getVendors Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get single vendor strictly by slug
  getVendorBySlug = async (req, res) => {
    try {
      const { slug } = req.params;

      const validOwners = await HallOwner.find({ is_public: true, is_verified: true }).select('_id').lean();
      const validOwnerIds = validOwners.map(owner => owner._id);

      const vendor = await Vendor.findOne({
        slug: slug.toLowerCase(),
        is_public: true,
        vendor_id: { $in: validOwnerIds }
      }).populate("vendor_id", "-password -otp");

      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      return res.status(200).json({ success: true, data: vendor });
    } catch (err) {
      console.error("Public getVendorBySlug Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  // Get all public vendors for a specific hall owner
  getVendorsByOwnerId = async (req, res) => {
    try {
      const { owner_id } = req.params;

      // Ensure the directly requested owner is verified and public
      const ownerCheck = await HallOwner.findOne({ _id: owner_id, is_public: true, is_verified: true }).select('_id').lean();
      if (!ownerCheck) {
        return res.status(404).json({ success: false, message: "Hall Owner not found, private, or unverified" });
      }

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const { search, city, street, category, has_discount, min_price, max_price } = req.query;
      const filter = { vendor_id: owner_id, is_public: true };

      if (search) filter.vendor_name = { $regex: search, $options: 'i' };
      if (city) filter['address.city'] = { $regex: city, $options: 'i' };
      if (street) filter['address.street_address'] = { $regex: street, $options: 'i' };
      if (category) filter.category = category;

      if (has_discount === 'true') {
        filter.discount = { $ne: null };
      } else if (has_discount === 'false') {
        filter.discount = null;
      }

      if (min_price || max_price) {
        filter.starting_price = {};
        if (min_price) filter.starting_price.$gte = Number(min_price);
        if (max_price) filter.starting_price.$lte = Number(max_price);
      }

      const vendors = await Vendor.find(filter)
        .populate("vendor_id", "-password -otp")
        .skip(skip)
        .limit(limit);

      const total = await Vendor.countDocuments(filter);

      return res.status(200).json({
        success: true,
        data: vendors,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      console.error("Public getVendorsByOwnerId Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = new PublicService();
