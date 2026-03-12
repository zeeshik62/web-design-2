const Customer = require("../models/Customer.model");

async function listCustomers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Customer.find({}, "-password").sort({ customer_id: 1 }).skip(skip).limit(limitNum),
      Customer.countDocuments({})
    ]);

    return res.json({
      success: true,
        data: items,
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getCustomerById(req, res) {
  try {
    const customer = await Customer.findById(req.params.id, "-password");
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

    return res.json({ success: true, data: customer });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

async function getCustomerByCustomerId(req, res) {
  try {
    const customerId = Number(req.params.customer_id);
    const customer = await Customer.findOne({ customer_id: customerId }, "-password");
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

    return res.json({ success: true, data: customer });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { listCustomers, getCustomerById, getCustomerByCustomerId };