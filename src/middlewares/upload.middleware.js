const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storageOptions = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.params.type; // expected: hall_owner_profile, subhall, or vendor
    if (!["hall_owner_profile", "subhall", "vendor"].includes(type)) {
      return cb(new Error("Invalid upload type. Must be 'hall_owner_profile', 'subhall', or 'vendor'"));
    }
    
    const dest = path.resolve("public", "uploads", type);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storageOptions,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

module.exports = upload;
