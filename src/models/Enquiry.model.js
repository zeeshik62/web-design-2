const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema(
  {
    enquiry_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    // storing Mongo ObjectId values:
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    hall_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "responded", "ignored"],
      default: "pending",
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", QuerySchema);