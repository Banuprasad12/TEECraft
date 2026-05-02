const router = require("express").Router();
const Product = require("../models/product");
const multer = require("multer");

// 🔹 Multer setup (for image upload)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage });


// ================= GET ALL PRODUCTS =================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json(err);
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
    res.status(500).json(err);
  }
});


// ================= UPDATE PRODUCT (🔥 NEW) =================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      qty: req.body.qty,
      desc: req.body.desc
    };

    // 🔥 If new image uploaded
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
    res.status(500).json(err);
  }
});
// ================= UPDATE PRODUCT =================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    console.log("UPDATE HIT"); // 🔥 check in terminal

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
    res.status(500).json(err);
  }
});
// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.log("GET ONE ERROR:", err);
    res.status(500).json(err);
  }
});

// ================= DELETE PRODUCT =================
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json(err);
  }
});

module.exports = router;