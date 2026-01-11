import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./BACKEND/utils/db.js";
import dotenv from "dotenv";
dotenv.config({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});     
app.listen(PORT, () => {    
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
    
});
// console.log(connectDB())/
