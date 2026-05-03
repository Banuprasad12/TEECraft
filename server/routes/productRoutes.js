const router = require("express").Router();
const Product = require("../models/product");
const multer = require("multer");
const fs = require("fs");

// ================= DEBUG =================
console.log("📦 Product routes loaded");

// ================= SAFE UPLOAD PATH =================
// Use /tmp for Railway (important)
const uploadDir = "/tmp/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ================= GET ALL PRODUCTS =================
router.get("/", async (req, res) => {
  try {
    console.log("👉 GET PRODUCTS HIT");

    const products = await Product.find().lean();

    res.json(products || []);

  } catch (err) {
    console.error("❌ GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= ADD PRODUCT =================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("👉 ADD PRODUCT HIT");

    const product = new Product({
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      qty: req.body.qty,
      desc: req.body.desc,
      image: req.file ? req.file.filename : null
    });

    await product.save();

    res.json(product);

  } catch (err) {
    console.error("❌ POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE PRODUCT =================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("👉 UPDATE PRODUCT HIT");

    const updatedData = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      qty: req.body.qty,
      desc: req.body.desc
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedProduct);

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    console.log("👉 GET ONE PRODUCT HIT");

    const product = await Product.findById(req.params.id);

    res.json(product);

  } catch (err) {
    console.error("❌ GET ONE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE PRODUCT =================
router.delete("/:id", async (req, res) => {
  try {
    console.log("👉 DELETE PRODUCT HIT");

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;