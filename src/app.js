import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/user", require("./routes/user"));
// app.use("/api/video", require("./routes/video"));
// app.use("/api/comment", require("./routes/comment"));

// Error handler
app.use(errorHandler);

export default app;
