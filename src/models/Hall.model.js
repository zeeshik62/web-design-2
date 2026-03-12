const mongoose = require("mongoose");

const HallSchema = new mongoose.Schema(
  {
    hall_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
      index: true,
    },
    hall_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
      index: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Optional compound index for faster listing/filtering
HallSchema.index({ location: 1, capacity: 1, pricePerPerson: 1, available: 1, hall_name: 1, imageUrl: 1 });

module.exports = mongoose.model("Hall", HallSchema);