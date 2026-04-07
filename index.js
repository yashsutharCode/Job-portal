import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./BACKEND/utils/db.js";
import userRoute from "./BACKEND/routes/user.route.js";
import companyRoute from "./BACKEND/routes/company.route.js";
import jobRoute from "./BACKEND/routes/job.route.js";
import applicationRoute from "./BACKEND/routes/application.route.js";
import aiRoute from "./BACKEND/routes/ai.route.js";

dotenv.config();

const app = express();
const _dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// PRODUCTION CORS FIX
const corsOptions = {
    origin: process.env.NODE_ENV === "production" 
        ? "https://job-find-8.onrender.com" 
        : "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/ai", aiRoute);

// Serving Static Frontend
app.use(express.static(path.join(_dirname, "/FRONTEND/dist")));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(_dirname, "FRONTEND", "dist", "index.html"));
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});