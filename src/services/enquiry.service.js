const Enquiry = require("../models/Enquiry.model");

// async function getEnquiryById(req, res) {
//   try {
//     const { id } = req.params;
//     console.log("Model: ", Enquiry.db.name, Enquiry.collection.name);
//     const enquiry = await Enquiry.findById(id);
//     if (!enquiry) {
//       return res.status(404).json({ success: false, message: "Enquiry not found" });
//     }

//     return res.status(200).json({ success: true, data: enquiry });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// }

async function listEnquiries(req, res) {
  try {
    const { customer_id, hall_id, status } = req.query;

    const filter = {};
    if (customer_id) filter.customer_id = customer_id;
    if (hall_id) filter.hall_id = hall_id;
    if (status) filter.status = status;

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: enquiries });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { 
    // getEnquiryById, 
    listEnquiries 
};