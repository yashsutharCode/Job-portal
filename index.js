import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Internal Imports
import connectDB from "./BACKEND/utils/db.js";
import userRoute from "./BACKEND/routes/user.route.js";
import companyRoute from "./BACKEND/routes/company.route.js";
import jobRoute from "./BACKEND/routes/job.route.js";
import applicationRoute from "./BACKEND/routes/application.route.js";

dotenv.config();

const app = express();
const _dirname = path.resolve();

// 1. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. CORS Configuration
// In production (Render), frontend and backend share the same origin.
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// 3. API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// 4. Serving Frontend (Static Files)
// This points to the folder created by 'npm run build' inside FRONTEND
app.use(express.static(path.join(_dirname, "/FRONTEND/dist")));

// 5. The "Catch-All" Route
// If any request doesn't match the API routes above, send the React index.html
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(_dirname, "FRONTEND", "dist", "index.html"));
});
// 6. Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});