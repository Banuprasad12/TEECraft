const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Safer CORS (allow frontend)
app.use(cors({
  origin: true, // allow all for now (you can restrict later)
  credentials: true
}));

// ================= SESSION =================
app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: false
}));

// ================= STATIC =================
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "TeeCraft backend is running"
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).json({ message: "Server Error" });
});

// ================= DB + SERVER START =================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("✅ MongoDB Connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ DB CONNECTION ERROR:", err);
});