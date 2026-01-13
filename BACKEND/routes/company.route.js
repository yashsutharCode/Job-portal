import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);

export default router;