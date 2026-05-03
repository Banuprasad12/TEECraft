const router = require("express").Router();
const Product = require("../models/product");
const multer = require("multer");
const fs = require("fs");

// ✅ Ensure uploads folder exists (VERY IMPORTANT for Railway)
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔹 Multer setup
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
    console.log("GET PRODUCTS HIT");
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= ADD PRODUCT =================
router.post("/", upload.single("image"), async (req, res) => {
  try {
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
    console.log("POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE PRODUCT =================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
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
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.log("GET ONE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE PRODUCT =================
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;