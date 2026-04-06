import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./BACKEND/utils/db.js";
import userRoute from "./BACKEND/routes/user.route.js";
import companyRoute from "./BACKEND/routes/company.route.js";
import jobRoute from "./BACKEND/routes/job.route.js";
import applicationRoute from "./BACKEND/routes/application.route.js";
import path from "path";

dotenv.config();

const app = express();
const _dirname = path.resolve();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// FIX: Update CORS for production
// On Render, both frontend and backend will be on the same domain, 
// but we keep this flexible for local development.
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// SERVING FRONTEND: This part tells the server where the "dist" folder is
app.use(express.static(path.join(_dirname, "/FRONTEND/dist")));

// The "Catch-all" route: If the request isn't an API call, send the React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, "FRONTEND", "dist", "index.html"));
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});