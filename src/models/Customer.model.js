const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    customer_id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 } // later: store hash instead
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);