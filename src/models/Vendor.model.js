const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street_address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const VendorSchema = new mongoose.Schema({
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "HallOwner", required: true, index: true },
  vendor_name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, enum: ["Caterer", "Photographer", "Decorator", "DJ", "Live Band", "Event Planner", "Make-up Artist"], required: true },
  address: { type: AddressSchema, required: true },
  images: [{ type: String }],
  staff: { type: String, enum: ["Male", "Female", "Both"], required: true },
  instructions: { type: String },
  discount: { type: Number, default: null },
  starting_price: { type: Number, default: 0 },
  is_public: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Vendor", VendorSchema);
