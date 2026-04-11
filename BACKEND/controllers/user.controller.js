import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// ================= REGISTER =================
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhoto = "";
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: { profilePhoto },
        });

        return res.status(201).json({ success: true, message: "Account created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Incorrect email or password" });
        }
        if (role !== user.role) {
            return res.status(400).json({ success: false, message: "Incorrect role" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        
        return res.status(200).cookie("token", token, { 
            httpOnly: true, 
            sameSite: "strict", 
            maxAge: 86400000 
        }).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: { 
                _id: user._id, 
                fullname: user.fullname, 
                email: user.email, 
                phoneNumber: user.phoneNumber, // Added for visibility
                role: user.role, 
                profile: user.profile 
            }
        });
    } catch (error) { 
        return res.status(500).json({ success: false }); 
    }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; 

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Update basic fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",").map(s => s.trim());

        // Handling Multiple Files via req.files
        if (req.files) {
            // 1. Handle Resume (PDF)
            if (req.files.file) {
                const resumeFile = req.files.file[0];
                const fileUri = getDataUri(resumeFile);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "raw",
                    format: "pdf",
                });
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = resumeFile.originalname;
            }

            // 2. Handle Profile Photo (Image)
            if (req.files.profilePhoto) {
                const photoFile = req.files.profilePhoto[0];
                const fileUri = getDataUri(photoFile);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                user.profile.profilePhoto = cloudResponse.secure_url;
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: { 
                _id: user._id, 
                fullname: user.fullname, 
                email: user.email, 
                phoneNumber: user.phoneNumber, 
                role: user.role, 
                profile: user.profile 
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
};