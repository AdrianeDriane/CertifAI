import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import apiRoutes from "./routes/api";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import groqRoutes from "./routes/groqRoutes";
import documentRoutes from "./routes/documentRoutes";
import "./config/passport";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-device-fingerprint"],
    credentials: true,
  })
);
app.use(helmet());

app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/groq", groqRoutes);

const PORT = process.env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Failed to start server:", err));
