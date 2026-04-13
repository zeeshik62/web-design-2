const SubHall = require("../models/SubHall.model");

class SubHallService {
  createSubHall = async (req, res) => {
    try {
      const { subhall_name, type, sitting_capacity, parking_capacity, address, menu, images, instructions } = req.body;
      const hall_owner_id = req.user.owner_id; // Securely pulled from valid JWT

      if (!subhall_name || !type || !sitting_capacity || !parking_capacity || !address || !address.street_address || !address.city || !address.country) {
        return res.status(400).json({ success: false, message: "Please provide all required fields including address" });
      }

      const generatedSlug = subhall_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const newSubHall = await SubHall.create({
        hall_owner_id,
        subhall_name,
        slug: generatedSlug,
        type,
        sitting_capacity,
        parking_capacity,
        address,
        menu: menu || {},
        images: images || [],
        instructions: instructions || ""
      });

      return res.status(201).json({ success: true, message: "SubHall created successfully", data: newSubHall });
    } catch (err) {
      console.error("createSubHall Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  getSubHalls = async (req, res) => {
    try {
      // Forcefully filter exclusively by the authenticated token's identity
      const filter = { hall_owner_id: req.user.owner_id };

      const subHalls = await SubHall.find(filter).populate("hall_owner_id", "name brand_name email");

      return res.status(200).json({ success: true, data: subHalls });
    } catch (err) {
      console.error("getSubHalls Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  getSubHallById = async (req, res) => {
    try {
      const { id } = req.params;
      const subHall = await SubHall.findById(id).populate("hall_owner_id", "name brand_name email");

      if (!subHall) {
        return res.status(404).json({ success: false, message: "SubHall not found" });
      }

      // Security Check
      if (subHall.hall_owner_id._id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized access to this SubHall" });
      }

      return res.status(200).json({ success: true, data: subHall });
    } catch (err) {
      console.error("getSubHallById Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  updateSubHall = async (req, res) => {
    try {
      const { id } = req.params;

      const subHall = await SubHall.findById(id);
      if (!subHall) {
        return res.status(404).json({ success: false, message: "SubHall not found" });
      }

      // Ensure the JWT holder maps to the document creator
      if (subHall.hall_owner_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this SubHall" });
      }

      const updateData = { ...req.body };
      if (updateData.subhall_name) {
        updateData.slug = updateData.subhall_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const updatedSubHall = await SubHall.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // Return modified version securely
      );

      return res.status(200).json({ success: true, message: "SubHall updated successfully", data: updatedSubHall });
    } catch (err) {
      console.error("updateSubHall Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  deleteSubHall = async (req, res) => {
    try {
      const { id } = req.params;

      const subHall = await SubHall.findById(id);
      if (!subHall) {
        return res.status(404).json({ success: false, message: "SubHall not found" });
      }

      if (subHall.hall_owner_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to delete this SubHall" });
      }

      await subHall.deleteOne();

      return res.status(200).json({ success: true, message: "SubHall deleted successfully" });
    } catch (err) {
      console.error("deleteSubHall Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = new SubHallService();
