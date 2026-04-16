const Customer = require("../models/Customer.model");
const Enquiry = require("../models/Enquiry.model");
const SubHall = require("../models/SubHall.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide name, email, and password" });
      }

      const existing = await Customer.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const customer_id = Math.floor(100000 + Math.random() * 900000);

      const customer = await Customer.create({
        customer_id,
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });

      return res.status(201).json({ success: true, message: "Registered successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
      }

      const customer = await Customer.findOne({ email: email.toLowerCase() });
      if (!customer || !(await bcrypt.compare(password, customer.password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { customer_id: customer._id, role: "customer" },
        process.env.JWT_SECRET || "HMS_SECRET_KEY",
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        token,
        data: { id: customer._id, name: customer.name, email: customer.email }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  submitQuery = async (req, res) => {
    try {
      const { subhall_slug, description, date } = req.body;
      const customer_id = req.user.customer_id;

      const subhall = await SubHall.findOne({ slug: subhall_slug });
      if (!subhall) return res.status(404).json({ success: false, message: "Venue not found" });

      const enquiry_id = Math.floor(1000000 + Math.random() * 9000000);
      const queryDate = date ? new Date(date) : new Date();

      const query = await Enquiry.create({
        enquiry_id,
        customer_id,
        hall_id: subhall._id,
        date: queryDate,
        description
      });

      return res.status(201).json({ success: true, message: "Query submitted successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  getRelatedCustomers = async (req, res) => {
    try {
      const ownerId = req.user.owner_id;
      const { name, page = 1, limit = 10 } = req.query;

      // 1. Find all subhalls owned by this owner
      const subhalls = await SubHall.find({ hall_owner_id: ownerId });
      const subhallIds = subhalls.map(sh => sh._id);

      // 2. Get unique customer IDs who have made enquiries for these subhalls
      const customerIds = await Enquiry.distinct("customer_id", { hall_id: { $in: subhallIds } });

      const filter = { _id: { $in: customerIds } };
      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;
      const skip = (pageNumber - 1) * pageSize;

      const total = await Customer.countDocuments(filter);
      const customers = await Customer.find(filter, "-password")
        .sort({ name: 1 })
        .skip(skip)
        .limit(pageSize);

      return res.status(200).json({
        success: true,
        data: customers,
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
}

module.exports = new CustomerController();
