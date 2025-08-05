import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import donationRoutes from "./routes/donations.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startCleanupJob } from "./services/cleanup.js";

// ✅ Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1"; // ✅ Ensures IPv4 use (avoids "::1" ECONNREFUSED issues)

// ✅ Connect to MongoDB
connectDB();

// ✅ Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Error handler middleware
app.use(errorHandler);

// ✅ Start background cleanup job
startCleanupJob();

// ✅ Start the Express server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(
    `📧 Email service: ${process.env.EMAIL_SERVICE || "Not configured"}`
  );
  console.log(
    `🗄️  Database: ${process.env.MONGODB_URI ? "Connected" : "Not configured"}`
  );
});
