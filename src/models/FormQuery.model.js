const mongoose = require("mongoose");

const FormQuerySchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    hall_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HallOwner",
      required: false,
      index: true,
    },
    subhall_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubHall",
      required: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "responded", "spam"],
      default: "pending",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormQuery", FormQuerySchema);
