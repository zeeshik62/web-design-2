const FormQuery = require("../models/FormQuery.model");

class FormQueryService {
  /**
   * Handle POST request from the frontend form.
   */
  async submitQuery(req, res) {
    try {
      const { customer_name, contact, email, message, hall_owner_id, subhall_id } = req.body;

      if (!customer_name || !contact || !email) {
        return res.status(400).json({
          success: false,
          message: "Customer name, contact, and email are required."
        });
      }

      const newQuery = new FormQuery({
        customer_name,
        contact,
        email,
        message,
        hall_owner_id,
        subhall_id
      });

      await newQuery.save();

      return res.status(201).json({
        success: true,
        message: "Form query submitted successfully.",
        data: newQuery
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * Handle GET request for the Hall Owner to view their queries.
   */
  async getQueries(req, res) {
    try {
      const filter = {};

      if (req.user && req.user.owner_id) {
        filter.hall_owner_id = req.user.owner_id;
      }

      const { status, customer_name, email, page = 1, limit = 10 } = req.query;

      if (status) {
        filter.status = status;
      }
      if (customer_name) {
        filter.customer_name = { $regex: customer_name, $options: "i" };
      }
      if (email) {
        filter.email = { $regex: email, $options: "i" };
      }

      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * pageSize;

      const totalQueries = await FormQuery.countDocuments(filter);
      const queries = await FormQuery.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        success: true,
        pagination: {
          total: totalQueries,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(totalQueries / pageSize)
        },
        data: queries
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * Handle PATCH request to update the status of a query.
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required." });
      }

      // Check against valid statuses dynamically from the schema
      const validStatuses = FormQuery.schema.path("status").enumValues;
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid status value. Must be one of: ${validStatuses.join(", ")}` 
        });
      }

      const query = await FormQuery.findById(id);

      if (!query) {
        return res.status(404).json({ success: false, message: "Query not found." });
      }

      // Authorization check (optional, depending on your rules)
      if (req.user && req.user.owner_id && query.hall_owner_id && query.hall_owner_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to update this query." });
      }

      query.status = status;
      await query.save();

      return res.status(200).json({
        success: true,
        message: "Query status updated successfully.",
        data: query
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * Handle DELETE request to delete a query.
   */
  async deleteQuery(req, res) {
    try {
      const { id } = req.params;

      const query = await FormQuery.findById(id);

      if (!query) {
        return res.status(404).json({ success: false, message: "Query not found." });
      }

      // Authorization check
      if (req.user && req.user.owner_id && query.hall_owner_id && query.hall_owner_id.toString() !== req.user.owner_id) {
        return res.status(403).json({ success: false, message: "Unauthorized to delete this query." });
      }

      await query.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Query deleted successfully."
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new FormQueryService();
