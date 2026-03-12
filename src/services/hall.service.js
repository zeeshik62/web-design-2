const Hall = require("../models/Hall.model");

async function listHalls(req, res) {
    try {
        const {
            location,
            available,
            minCap,
            maxCap,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        if (location) filter.location = { $regex: location, $options: "i" };

        if (available === "true") filter.available = true;
        if (available === "false") filter.available = false;

        if (minCap || maxCap) {
            filter.capacity = {};
            if (minCap) filter.capacity.$gte = Number(minCap);
            if (maxCap) filter.capacity.$lte = Number(maxCap);
        }

        if (minPrice || maxPrice) {
            filter.pricePerPerson = {};
            if (minPrice) filter.pricePerPerson.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerPerson.$lte = Number(maxPrice);
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(50, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [halls, total] = await Promise.all([
            Hall.find(filter).sort({ hall_id: 1 }).skip(skip).limit(limitNum),
            Hall.countDocuments(filter),
        ]);

        // const hallsById = {};
        // for (const h of items) {
        //     hallsById[h.hall_id] = h;
        // }

        return res.status(200).json({
            success: true,
            data: halls,
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { listHalls };