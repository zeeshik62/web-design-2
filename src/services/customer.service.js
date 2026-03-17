const Customer = require("../models/Customer.model");

class CustomerController {

  listCustomers = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(50, Math.max(1, Number(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [items, total] = await Promise.all([
        Customer.find({}, "-password")
          .sort({ customer_id: 1 })
          .skip(skip)
          .limit(limitNum),

        Customer.countDocuments({})
      ]);

      return res.status(200).json({
        success: true,
        data: items,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };

  getCustomerById = async (req, res) => {
    try {
      const { id } = req.params;

      const customer = await Customer.findById(id, "-password");

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: customer
      });

    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  };

  getCustomerByCustomerId = async (req, res) => {
    try {
      const customerId = Number(req.params.customer_id);

      if (isNaN(customerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer_id"
        });
      }

      const customer = await Customer.findOne(
        { customer_id: customerId },
        "-password"
      );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: customer
      });

    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  };

}

module.exports = new CustomerController();
