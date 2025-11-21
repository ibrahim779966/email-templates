const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

// --- Import Custom Components ---
const templateRoutes = require("./src/routes/template.routes");
const errorHandler = require("./src/middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
// In your Express app

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
// --- Middleware Setup ---
// app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: "1000mb" })); // Body parser for incoming JSON payloads
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// --- Database Connection ---
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully."))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    // Exit the process if the database connection fails
    process.exit(1);
  });

// --- Routes Setup ---
app.get("/", (req, res) => {
  res.send("Template Service Backend is operational.");
});

// Load the Template CRUD routes under the base API path
app.use("/api/v1/templates", templateRoutes);

// --- Global Error Handler (MUST be the last piece of middleware before the listen call) ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
