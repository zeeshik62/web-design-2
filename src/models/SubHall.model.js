const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street_address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const MenuSchema = new mongoose.Schema({
  starter: [{ type: String }],
  main_course: [{ type: String }],
  drinks: [{ type: String }],
  desserts: [{ type: String }]
}, { _id: false });

const SubHallSchema = new mongoose.Schema({
  hall_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "HallOwner", required: true, index: true },
  subhall_name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  type: { type: String, enum: ["Marquee", "Open Roof", "Banquet Hall", "Conference Room", "Other"], required: true },
  sitting_capacity: { type: Number, required: true, min: 1 },
  parking_capacity: { type: Number, required: true, min: 0 },
  address: { type: AddressSchema, required: true },
  menu: { type: MenuSchema, default: {} },
  images: [{ type: String }],
  instructions: { type: String },
  discount: { type: Number, default: null },
  starting_price: { type: Number, default: 0 },
  is_public: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("SubHall", SubHallSchema);
