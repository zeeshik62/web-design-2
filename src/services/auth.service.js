const HallOwner = require("../models/HallOwner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

class AuthService {
  register = async (req, res) => {
    try {
      const { name, brand_name, email, password, contact, address, image } = req.body;

      if (!name || !brand_name || !email || !password || !contact || !address || !address.street_address || !address.city || !address.country) {
        return res.status(400).json({ success: false, message: "Please provide all required fields including address" });
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

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      const newOwner = await HallOwner.create({
        name,
        brand_name,
        slug: generatedSlug,
        email: email.toLowerCase(),
        password: hashedPassword,
        contact,
        address,
        image: image || "",
        otp: generatedOtp
        // is_verified remains false uniquely native by schema default
      });

      const message = `Welcome to HMS! Your registration verification OTP is: ${generatedOtp}\nPlease use this OTP to securely verify your account identity to login.`;
      try {
        await sendEmail({
          email: newOwner.email,
          subject: "Registration verification OTP",
          message,
        });
      } catch (err) {
        console.error("Failed to send OTP email:", err);
      }

      return res.status(201).json({
        success: true,
        message: "Your account has been created successfully. Please verify your account using the OTP sent to your email."
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

      if (!owner.is_verified) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        owner.otp = generatedOtp;
        await owner.save();
        const message = `Welcome to HMS! Your registration verification OTP is: ${generatedOtp}\nPlease use this OTP to securely verify your account identity to login.`;
        try {
          await sendEmail({
            email: owner.email,
            subject: "Registration verification OTP",
            message,
          });
        } catch (err) {
          console.error("Failed to send OTP email:", err);
        }
        return res.status(403).json({ success: false, message: "Your account is not verified. Please use the OTP we sent to verify your account to login" });
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

  verifyRegistration = async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Please provide email and otp" });
      }

      const owner = await HallOwner.findOne({ email: email.toLowerCase() });
      if (!owner) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (owner.otp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      // Mark as verified and clear OTP
      owner.is_verified = true;
      owner.otp = null;
      await owner.save();

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
        message: "Account verified successfully",
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
