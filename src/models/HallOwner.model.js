const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street_address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const HallOwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    brand_name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    contact: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    image: { type: String, default: "" },
    cover_image: { type: String, default: "" },
    otp: { type: String, default: null },
    is_verified: { type: Boolean, default: false },
    is_public: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const HallOwner = mongoose.model("HallOwner", HallOwnerSchema);

module.exports = HallOwner;

// Attempt to drop the obsolete index safely in the background
mongoose.connection.on('connected', () => {
  HallOwner.collection.dropIndex("owner_id_1").catch(() => { });
});
