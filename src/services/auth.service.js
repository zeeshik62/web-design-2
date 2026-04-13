const HallOwner = require("../models/HallOwner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

class AuthService {
  register = async (req, res) => {
    try {
      const { name, brand_name, email, password, otp } = req.body;
      
      if (!name || !brand_name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
      }

      const generatedSlug = brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const existingOwner = await HallOwner.findOne({ 
        $or: [
          { email: email.toLowerCase() },
          { slug: generatedSlug },
          { brand_name: brand_name }
        ]
      });

      if (existingOwner) {
        return res.status(400).json({ success: false, message: "Email, brand name or slug already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newOwner = await HallOwner.create({
        name,
        brand_name,
        slug: generatedSlug,
        email: email.toLowerCase(),
        password: hashedPassword,
        otp: otp || null
      });

      return res.status(201).json({
        success: true,
        message: "Hall Owner registered successfully",
        data: {
          owner_id: newOwner._id,
          name: newOwner.name,
          brand_name: newOwner.brand_name,
          slug: newOwner.slug,
          email: newOwner.email,
          created_at: newOwner.created_at
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
      }

      const owner = await HallOwner.findOne({ email: email.toLowerCase() });
      if (!owner) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const payload = {
        owner_id: owner._id,
        name: owner.name,
        brand_name: owner.brand_name,
        slug: owner.slug,
        email: owner.email,
        role: "hall_owner"
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || "HMS_SECRET_KEY", { expiresIn: "1d" });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        data: {
          owner_id: owner._id,
          name: owner.name,
          email: owner.email
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "Please provide an email" });
      }

      const owner = await HallOwner.findOne({ email: email.toLowerCase() });
      if (!owner) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      owner.otp = otp;
      await owner.save();

      const message = `Your password reset OTP is: ${otp}\nThis OTP is valid to reset your password.`;

      try {
        await sendEmail({
          email: owner.email,
          subject: "Password Reset OTP",
          message,
        });

        return res.status(200).json({ success: true, message: "OTP sent to email" });
      } catch (err) {
        owner.otp = null;
        await owner.save();
        return res.status(500).json({ success: false, message: "Email could not be sent" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Please provide email, otp and newPassword" });
      }

      const owner = await HallOwner.findOne({ email: email.toLowerCase() });
      if (!owner) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (owner.otp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      owner.password = hashedPassword;
      owner.otp = null;
      await owner.save();

      return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = new AuthService();
