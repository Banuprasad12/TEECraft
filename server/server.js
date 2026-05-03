const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED CORS (VERY IMPORTANT)
app.use(cors({
  origin: "https://tee-craft-hlc2.vercel.app", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());

// ================= SESSION (optional - can disable if not needed) =================
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

mongoose.set("strictQuery", false);

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