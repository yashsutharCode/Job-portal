// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";

// const router = express.Router();

// router.route("/register").post(isAuthenticated, registerCompany);
// router.route("/get").get(isAuthenticated, getCompany);
// router.route("/get/:id").get(isAuthenticated, getCompanyById);
// router.route("/update/:id").put(isAuthenticated, updateCompany);

// export default router;

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js"; // ✅ ADD THIS

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);

// ✅ FIX HERE
router.route("/update/:id").put(
  isAuthenticated,
  singleUpload,   // 🔥 REQUIRED for form-data
  updateCompany
);

export default router;