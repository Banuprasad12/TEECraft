const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user"
    });

    res.json(user);

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const user = await User.findOne({
      email: req.body.email.trim(),
      password: req.body.password.trim()
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