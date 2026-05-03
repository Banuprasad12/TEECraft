const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password } = req.body;

    // 🔥 VALIDATION (IMPORTANT)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check existing user
    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: "user"
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.trim(),
      password: password.trim()
    });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;