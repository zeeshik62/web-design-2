const HallOwner = require('../models/HallOwner.model');
const Enquiry = require('../models/Enquiry.model');
const SubHall = require('../models/SubHall.model');
const Customer = require('../models/Customer.model');

class HallOwnerService {
    getProfile = async (req, res) => {
        try {
            const ownerId = req.user.owner_id;
            const owner = await HallOwner.findById(ownerId).select("-password -otp");
            
            if (!owner) {
                return res.status(404).json({ success: false, message: "Hall Owner not found" });
            }

            return res.status(200).json({ success: true, data: owner });
        } catch (error) {
            console.error("getProfile Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    };

    getDashboardStats = async (req, res) => {
        try {
            const ownerId = req.user.owner_id;
            const Vendor = require('../models/Vendor.model');
            const VendorQuery = require('../models/VendorQuery.model');

            // 1. Get SubHalls stats
            const subhalls = await SubHall.find({ hall_owner_id: ownerId }).select('_id');
            const subhallIds = subhalls.map(sh => sh._id);
            const totalHalls = subhalls.length;

            // 2. Get Vendors stats
            const vendors = await Vendor.find({ owner_id: ownerId }).select('_id');
            const vendorIds = vendors.map(v => v._id);
            const totalVendors = vendors.length;

            // 3. Get Enquiries counts
            const totalHallEnquiries = await Enquiry.countDocuments({ hall_id: { $in: subhallIds } });
            const totalVendorEnquiries = await VendorQuery.countDocuments({ vendor_id: { $in: vendorIds } });
            
            // 4. Get unique Customers count (who have made enquiries for either halls or vendors)
            const customersFromHalls = await Enquiry.distinct("customer_id", { hall_id: { $in: subhallIds } });
            const customersFromVendors = await VendorQuery.distinct("customer_id", { vendor_id: { $in: vendorIds } });
            
            // Combine and unique-ify
            const allCustomerIds = [...new Set([
                ...customersFromHalls.map(id => id.toString()), 
                ...customersFromVendors.map(id => id.toString())
            ])];
            const totalCustomers = allCustomerIds.length;

            return res.status(200).json({
                success: true,
                data: {
                    totalHalls,
                    totalVendors,
                    totalHallEnquiries,
                    totalVendorEnquiries,
                    totalCustomers,
                    combinedEnquiries: totalHallEnquiries + totalVendorEnquiries
                }
            });
        } catch (error) {
            console.error("getDashboardStats Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    };

    updateProfile = async (req, res) => {
        try {
            const { name, brand_name, contact, address, image, cover_image, is_public } = req.body;
            const ownerId = req.user.owner_id;

            const owner = await HallOwner.findById(ownerId);
            if (!owner) {
                return res.status(404).json({ success: false, message: "Hall Owner not found" });
            }

            // Update allowed fields
            if (name !== undefined) owner.name = name;
            if (contact !== undefined) owner.contact = contact;
            if (address !== undefined) {
                if (!address.street_address || !address.city || !address.country) {
                    return res.status(400).json({ success: false, message: "Incomplete address object" });
                }
                owner.address = address;
            }
            if (image !== undefined) owner.image = image;
            if (cover_image !== undefined) owner.cover_image = cover_image;
            if (is_public !== undefined) owner.is_public = is_public;

            // Generate new slug if brand_name changes
            if (brand_name && brand_name !== owner.brand_name) {
                const generatedSlug = brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

                const existingOwner = await HallOwner.findOne({
                    _id: { $ne: ownerId },
                    $or: [
                        { brand_name: brand_name },
                        { slug: generatedSlug }
                    ]
                });

                if (existingOwner) {
                    return res.status(400).json({ success: false, message: "This brand name is already registered. Please choose a different name." });
                }

                owner.brand_name = brand_name;
                owner.slug = generatedSlug;
            }

            await owner.save();

            return res.status(200).json({ 
                success: true, 
                message: "Profile updated successfully", 
                data: {
                    owner_id: owner._id,
                    name: owner.name,
                    brand_name: owner.brand_name,
                    slug: owner.slug,
                    email: owner.email,
                    contact: owner.contact,
                    address: owner.address,
                    image: owner.image,
                    is_public: owner.is_public
                } 
            });
        } catch (error) {
            // Handle duplicate brand_name/slug errors
            if (error.code === 11000) {
                return res.status(400).json({ success: false, message: "Brand name already exists" });
            }
            return res.status(500).json({ success: false, message: error.message });
        }
    };

    toggleIsPublic = async (req, res) => {
        try {
            const ownerId = req.user.owner_id;
            const owner = await HallOwner.findById(ownerId);
            
            if (!owner) {
                return res.status(404).json({ success: false, message: "Hall Owner not found" });
            }

            owner.is_public = !owner.is_public;
            await owner.save();

            return res.status(200).json({ 
                success: true, 
                message: `Profile visibility is now manually toggled to ${owner.is_public ? 'public' : 'private'}`, 
                data: { is_public: owner.is_public } 
            });
        } catch (error) {
            console.error("toggleIsPublic Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    };
}

module.exports = new HallOwnerService();
