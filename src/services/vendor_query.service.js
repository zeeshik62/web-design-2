const VendorQuery = require("../models/VendorQuery.model");
const Vendor = require("../models/Vendor.model");
const Customer = require("../models/Customer.model");

class VendorQueryService {
  /**
   * Customer submits a query for a vendor (by vendor slug).
   * Protected by customer auth middleware — req.user.customer_id is the Customer ObjectId.
   */
  submitVendorQuery = async (req, res) => {
    try {
      const { vendor_slug, description, date } = req.body;
      const customer_id = req.user.customer_id;

      if (!vendor_slug || !description) {
        return res.status(400).json({ success: false, message: "vendor_slug and description are required." });
      }

      const vendor = await Vendor.findOne({ slug: vendor_slug });
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found." });
      }

      const queryDate = date ? new Date(date) : new Date();

      const query = await VendorQuery.create({
        customer_id,
        vendor_id: vendor._id,
        date: queryDate,
        description,
      });

      return res.status(201).json({ success: true, message: "Vendor query submitted successfully.", data: query });
    } catch (err) {
      console.error("submitVendorQuery Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  /**
   * Owner fetches all vendor queries for their vendors.
   * Protected by owner auth middleware — req.user.owner_id is the HallOwner ObjectId.
   */
  getOwnerVendorQueries = async (req, res) => {
    try {
      const ownerId = req.user.owner_id;
      const { status, customer_name, page = 1, limit = 10 } = req.query;

      // 1. Find all vendors owned by this hall owner
      const vendors = await Vendor.find({ vendor_id: ownerId }).select("_id");
      const vendorIds = vendors.map(v => v._id);

      const filter = { vendor_id: { $in: vendorIds } };

      if (status) filter.status = status;

      // 2. Filter by customer name if provided
      if (customer_name) {
        const customers = await Customer.find({
          name: { $regex: customer_name, $options: "i" }
        }).select("_id");
        const customerIds = customers.map(c => c._id);
        filter.customer_id = { $in: customerIds };
      }

      const pageNumber = parseInt(page, 10) || 1;
      const pageSize  = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * pageSize;

      const total = await VendorQuery.countDocuments(filter);
      const queries = await VendorQuery.find(filter)
        .populate("customer_id", "name email")
        .populate("vendor_id", "vendor_name slug category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        success: true,
        data: queries,
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (err) {
      console.error("getOwnerVendorQueries Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  /**
   * Owner updates the status of a vendor query.
   */
  updateVendorQueryStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ownerId = req.user.owner_id;

      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required." });
      }

      const query = await VendorQuery.findById(id).populate("vendor_id");
      if (!query) {
        return res.status(404).json({ success: false, message: "Vendor query not found." });
      }

      // Authorization: check the vendor belongs to this owner
      if (query.vendor_id.vendor_id.toString() !== ownerId) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this query." });
      }

      query.status = status;
      await query.save();

      return res.status(200).json({ success: true, message: "Status updated successfully.", data: query });
    } catch (err) {
      console.error("updateVendorQueryStatus Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = new VendorQueryService();
