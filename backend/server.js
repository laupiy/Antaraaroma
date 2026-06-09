require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes         = require("./routes/auth");
const productRoutes      = require("./routes/products");
const categoryRoutes     = require("./routes/categories");
const reviewRoutes       = require("./routes/reviews");
const homeContentRoutes  = require("./routes/homeContent");
const distributionRoutes = require("./routes/distribution");
const catalogFilterRoutes= require("./routes/catalogFilters");
const contactRoutes      = require("./routes/contacts");
const uploadRoutes       = require("./routes/upload");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // 10 MB untuk base64 image upload

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",            authRoutes);
app.use("/api/upload",          uploadRoutes);
app.use("/api/products",        productRoutes);
app.use("/api/categories",      categoryRoutes);
app.use("/api/reviews",         reviewRoutes);
app.use("/api/home-content",    homeContentRoutes);
app.use("/api/distribution",    distributionRoutes);
app.use("/api/catalog-filters", catalogFilterRoutes);
app.use("/api/contacts",        contactRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
