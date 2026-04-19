const Vendor = require("../models/Vendor.model");

class VendorService {
  createVendor = async (req, res) => {
    try {
      const { vendor_name, category, address, images, staff, instructions, is_public, discount, starting_price } = req.body;
      const vendor_id = req.user.owner_id; // Securely pulled from valid JWT

      if (!vendor_name || !category || !address || !address.street_address || !address.city || !address.country || !staff) {
        return res.status(400).json({ success: false, message: "Please provide all required fields including address and staff" });
      }

      const generatedSlug = vendor_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Check for uniqueness
      const existingVendor = await Vendor.findOne({
        $or: [
          { vendor_name },
          { slug: generatedSlug }
        ]
      });

      if (existingVendor) {
        return res.status(400).json({ success: false, message: "A Vendor Service with this name already exists. Please choose a different name." });
      }

      const newVendor = await Vendor.create({
        vendor_id,
        vendor_name,
        slug: generatedSlug,
        category,
        address,
        images: images || [],
        staff,
        instructions: instructions || "",
        discount: discount || null,
        starting_price: starting_price || 0,
        is_public: is_public !== undefined ? is_public : true
      });

      return res.status(201).json({ success: true, message: "Vendor created successfully", data: newVendor });
    } catch (err) {
      console.error("createVendor Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  getVendors = async (req, res) => {
    try {
      // Forcefully filter exclusively by the authenticated token's identity
      const filter = { vendor_id: req.user.owner_id };
      
      const { search, city, street, category, has_discount, min_price, max_price } = req.query;

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

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const vendors = await Vendor.find(filter)
        .populate("vendor_id", "name brand_name email")
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
      console.error("getVendors Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  getVendorById = async (req, res) => {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findById(id).populate("vendor_id", "name brand_name email");

      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      // Security Check
      if (vendor.vendor_id._id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized access to this Vendor" });
      }

      return res.status(200).json({ success: true, data: vendor });
    } catch (err) {
      console.error("getVendorById Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  updateVendor = async (req, res) => {
    try {
      const { id } = req.params;

      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      // Ensure the JWT holder maps to the document creator
      if (vendor.vendor_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this Vendor" });
      }

      const updateData = { ...req.body };
      if (updateData.vendor_name) {
        updateData.slug = updateData.vendor_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        // Check for uniqueness during update
        const existingVendor = await Vendor.findOne({
          _id: { $ne: id },
          $or: [
            { vendor_name: updateData.vendor_name },
            { slug: updateData.slug }
          ]
        });

        if (existingVendor) {
          return res.status(400).json({ success: false, message: "A Vendor with this name already exists. Please choose a different name." });
        }
      }

      const updatedVendor = await Vendor.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // Return modified version securely
      );

      return res.status(200).json({ success: true, message: "Vendor updated successfully", data: updatedVendor });
    } catch (err) {
      console.error("updateVendor Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  deleteVendor = async (req, res) => {
    try {
      const { id } = req.params;

      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      if (vendor.vendor_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to delete this Vendor" });
      }

      await vendor.deleteOne();

      return res.status(200).json({ success: true, message: "Vendor deleted successfully" });
    } catch (err) {
      console.error("deleteVendor Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  toggleIsPublic = async (req, res) => {
    try {
      const { id } = req.params;

      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }

      // Security check: Must own the vendor service
      if (vendor.vendor_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this Vendor" });
      }

      vendor.is_public = !vendor.is_public;
      await vendor.save();

      return res.status(200).json({ success: true, message: "Vendor visibility toggled successfully", data: vendor });
    } catch (err) {
      console.error("toggleIsPublic Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = new VendorService();
