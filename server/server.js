const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
   origin: "https://your-vercel-app.vercel.app",
  credentials: true
}));

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: false
}));

app.use("/uploads", express.static("uploads"));

// ✅ ROUTES ONLY
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tshirt_store";

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));