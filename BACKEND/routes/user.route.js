import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Handle both 'file' (resume) and 'profilePhoto' (avatar)
router.route("/profile/update").post(
    isAuthenticated, 
    singleUpload.fields([
        { name: 'file', maxCount: 1 }, 
        { name: 'profilePhoto', maxCount: 1 }
    ]), 
    updateProfile
);

export default router;