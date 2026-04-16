const Enquiry = require("../models/Enquiry.model");
const SubHall = require("../models/SubHall.model");
const Customer = require("../models/Customer.model");

class EnquiryController {
  async listEnquiries(req, res) {
    try {
      const { customer_id, hall_id, status } = req.query;

      const filter = {};

      if (customer_id) filter.customer_id = customer_id;
      if (hall_id) filter.hall_id = hall_id;
      if (status) filter.status = status;

      const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: enquiries
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async getOwnerEnquiries(req, res) {
    try {
      const ownerId = req.user.owner_id;
      const { status, customer_name, page = 1, limit = 10 } = req.query;

      // 1. Find all subhalls owned by this owner
      const subhalls = await SubHall.find({ hall_owner_id: ownerId });
      const subhallIds = subhalls.map(sh => sh._id);

      const filter = { hall_id: { $in: subhallIds } };

      if (status) {
        filter.status = status;
      }

      // 2. If filtering by customer name, find customer IDs first
      if (customer_name) {
        const customers = await Customer.find({
          name: { $regex: customer_name, $options: "i" }
        });
        const customerIds = customers.map(c => c._id);
        filter.customer_id = { $in: customerIds };
      }

      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * pageSize;

      const total = await Enquiry.countDocuments(filter);
      const enquiries = await Enquiry.find(filter)
        .populate("customer_id", "name email")
        .populate("hall_id", "subhall_name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        success: true,
        data: enquiries,
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async updateEnquiryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ownerId = req.user.owner_id;

      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required." });
      }

      const enquiry = await Enquiry.findById(id).populate("hall_id");
      if (!enquiry) {
        return res.status(404).json({ success: false, message: "Enquiry not found." });
      }

      // Authorization: Check if the hall belongs to the owner
      if (enquiry.hall_id.hall_owner_id.toString() !== ownerId) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this enquiry." });
      }

      enquiry.status = status;
      await enquiry.save();

      return res.status(200).json({
        success: true,
        message: "Enquiry status updated successfully.",
        data: enquiry
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new EnquiryController();
// async function getEnquiryById(req, res) {
//   try {
//     const { id } = req.params;
//     console.log("Model: ", Enquiry.db.name, Enquiry.collection.name);
//     const enquiry = await Enquiry.findById(id);
//     if (!enquiry) {
//       return res.status(404).json({ success: false, message: "Enquiry not found" });
//     }

//     return res.status(200).json({ success: true, data: enquiry });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// }
