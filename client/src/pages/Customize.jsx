import { useEffect, useState } from "react";
import "../styles/customize.css";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaHeart, FaUser } from "react-icons/fa";
import { BsBag } from "react-icons/bs";
import lionLogo from "../assets/lion.svg";

export default function Customize() {

  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("polo");
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedSize, setSelectedSize] = useState("M");
  const [uploadedImage, setUploadedImage] = useState(null);
  

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ NEW: ICON RENDER FUNCTION
  const renderIcon = (type) => {
    switch (type) {
      case "star": return "⭐";
      case "dots": return "⚪";
      case "circle": return "⬤";
      case "triangle": return "▲";
      case "square": return "■";
      case "diamond": return "◆";
      case "flower": return "✿";
      case "sun": return "☀";
      case "ring": return "◎";
      case "waves": return "≈";
      case "hex": return "⬢";
      case "plus": return "✚";
      default: return "•";
    }
  };

  useEffect(() => {
    const canvas = document.getElementById("tshirtCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let mode = "body";
    let bodyColor = "#ffffff";
    let sleeveColor = "#ffffff";
    let designColor = "#000000";
    let currentDesign = null;

    const shirtImg = new Image();
    const maskImg = new Image();
    let maskData = null;

    function loadShirt(type) {
      setSelectedType(type);

      shirtImg.src = `/images/${type}.png`;
      maskImg.src = `/images/${type}_mask.png`;

      shirtImg.onload = () => {
        canvas.width = shirtImg.width;
        canvas.height = shirtImg.height;

        maskImg.onload = () => {
          const t = document.createElement("canvas");
          t.width = canvas.width;
          t.height = canvas.height;
          const tctx = t.getContext("2d");
          tctx.drawImage(maskImg, 0, 0);
          maskData = tctx.getImageData(0, 0, canvas.width, canvas.height);
          draw();
        };
      };
    }

    function setType(type) {
      document.getElementById("btnPolo").classList.remove("active");
      document.getElementById("btnRound").classList.remove("active");

      if (type === "polo")
        document.getElementById("btnPolo").classList.add("active");
      else
        document.getElementById("btnRound").classList.add("active");

      loadShirt(type);
    }

    function setMode(m) {
      mode = m;

      document.getElementById("bodyBtn").classList.remove("active");
      document.getElementById("sleeveBtn").classList.remove("active");

      if (m === "body")
        document.getElementById("bodyBtn").classList.add("active");
      else
        document.getElementById("sleeveBtn").classList.add("active");
    }

    function applyColor(color) {
      if (mode === "body") bodyColor = color;
      else sleeveColor = color;

      setSelectedColor(color);
      draw();
    }

    function setDesign(d) {
      currentDesign = d;
      setSelectedDesign(d);

      document.querySelectorAll(".design-item").forEach(b =>
        b.classList.remove("active")
      );

      const el = document.getElementById("design_" + d);
      if (el) el.classList.add("active");

      draw();
    }

    function setDesignColor(c) {
      designColor = c;
      draw();
    }

    function hexToRgb(hex) {
      const v = parseInt(hex.slice(1), 16);
      return {
        r: (v >> 16) & 255,
        g: (v >> 8) & 255,
        b: v & 255
      };
    }

    function multiplyColor(data, i, color) {
      data[i] = (data[i] * color.r) / 255;
      data[i + 1] = (data[i + 1] * color.g) / 255;
      data[i + 2] = (data[i + 2] * color.b) / 255;
    }

    function drawStarOn(ctx2, cx, cy, outerRadius, points) {
      const step = Math.PI / points;
      ctx2.beginPath();
      for (let i = 0; i < 2 * points; i++) {
        const r = i % 2 === 0 ? outerRadius : outerRadius / 2;
        const a = i * step;
        ctx2.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx2.closePath();
      ctx2.fill();
    }

    function drawDesign() {
      if (!currentDesign || !maskData) return;

      const temp = document.createElement("canvas");
      temp.width = canvas.width;
      temp.height = canvas.height;
      const tctx = temp.getContext("2d");

      tctx.fillStyle = designColor;

      const w = canvas.width;
      const h = canvas.height;

      if (currentDesign === "star") {
        for (let y = 40; y < h - 40; y += 80)
          for (let x = 40; x < w - 40; x += 80)
            drawStarOn(tctx, x, y, 12, 5);
      }

      if (currentDesign === "dots") {
        for (let y = 20; y < h; y += 30)
          for (let x = 20; x < w; x += 30) {
            tctx.beginPath();
            tctx.arc(x, y, 4, 0, Math.PI * 2);
            tctx.fill();
          }
      }
      // 🔶 DIAMOND
      if (currentDesign === "diamond") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.beginPath();
            tctx.moveTo(x, y - 10);
            tctx.lineTo(x + 10, y);
            tctx.lineTo(x, y + 10);
            tctx.lineTo(x - 10, y);
            tctx.closePath();
            tctx.fill();
          }
      }

      // 🌸 FLOWER
      if (currentDesign === "flower") {
        for (let y = 50; y < h; y += 70)
          for (let x = 50; x < w; x += 70) {
            for (let i = 0; i < 6; i++) {
              tctx.beginPath();
              tctx.arc(
                x + Math.cos(i * Math.PI / 3) * 10,
                y + Math.sin(i * Math.PI / 3) * 10,
                5,
                0,
                Math.PI * 2
              );
              tctx.fill();
            }
          }
      }

      // ☀️ SUN
      if (currentDesign === "sun") {
        for (let y = 50; y < h; y += 70)
          for (let x = 50; x < w; x += 70) {
            tctx.beginPath();
            tctx.arc(x, y, 6, 0, Math.PI * 2);
            tctx.fill();

            for (let i = 0; i < 8; i++) {
              tctx.beginPath();
              tctx.moveTo(x, y);
              tctx.lineTo(
                x + Math.cos(i * Math.PI / 4) * 15,
                y + Math.sin(i * Math.PI / 4) * 15
              );
              tctx.strokeStyle = designColor;
              tctx.stroke();
            }
          }
      }

      // ◎ RING
      if (currentDesign === "ring") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.beginPath();
            tctx.arc(x, y, 10, 0, Math.PI * 2);
            tctx.strokeStyle = designColor;
            tctx.lineWidth = 2;
            tctx.stroke();
          }
      }

      // ≈ WAVES
      if (currentDesign === "waves") {
        for (let y = 40; y < h; y += 50)
          for (let x = 20; x < w; x += 60) {
            tctx.beginPath();
            tctx.moveTo(x, y);
            tctx.quadraticCurveTo(x + 10, y - 10, x + 20, y);
            tctx.quadraticCurveTo(x + 30, y + 10, x + 40, y);
            tctx.strokeStyle = designColor;
            tctx.stroke();
          }
      }

      // ⬢ HEX
      if (currentDesign === "hex") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.beginPath();
            for (let i = 0; i < 6; i++) {
              tctx.lineTo(
                x + Math.cos(i * Math.PI / 3) * 10,
                y + Math.sin(i * Math.PI / 3) * 10
              );
            }
            tctx.closePath();
            tctx.fill();
          }
      }

      // ✚ PLUS
      if (currentDesign === "plus") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.fillRect(x - 2, y - 10, 4, 20);
            tctx.fillRect(x - 10, y - 2, 20, 4);
          }
      }

      // ✅ NEW DESIGNS
      if (currentDesign === "circle") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.beginPath();
            tctx.arc(x, y, 10, 0, Math.PI * 2);
            tctx.fill();
          }
      }

      if (currentDesign === "triangle") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.beginPath();
            tctx.moveTo(x, y);
            tctx.lineTo(x + 12, y + 20);
            tctx.lineTo(x - 12, y + 20);
            tctx.closePath();
            tctx.fill();
          }
      }

      if (currentDesign === "square") {
        for (let y = 40; y < h; y += 60)
          for (let x = 40; x < w; x += 60) {
            tctx.fillRect(x - 10, y - 10, 20, 20);
          }
      }

      const designImg = tctx.getImageData(0, 0, w, h);
      const d = designImg.data;
      const m = maskData.data;

      for (let i = 0; i < d.length; i += 4) {
        if (m[i] < 120) d[i + 3] = 0;
      }

      tctx.putImageData(designImg, 0, 0);
      ctx.drawImage(temp, 0, 0);
    }

    function draw() {
      if (!maskData) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(shirtImg, 0, 0);
     
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = img.data;
      const m = maskData.data;

      const b = hexToRgb(bodyColor);
      const s = hexToRgb(sleeveColor);

      for (let i = 0; i < d.length; i += 4) {
        const v = m[i];
        if (v > 240) multiplyColor(d, i, b);
        else if (v > 120) multiplyColor(d, i, s);
      }

      ctx.putImageData(img, 0, 0);
      drawDesign();
       // ✅ Uploaded Image
      if (uploadedImage) {
        const img2 = new Image();
        img2.src = uploadedImage;

        img2.onload = () => {
          const size = canvas.width * 0.3;
          const x = canvas.width / 2 - size / 2;
          const y = canvas.height * 0.55 - size / 2;

          ctx.drawImage(img2, x, y, size, size);
        };
      }
    }

    window.setType = setType;
    window.setMode = setMode;
    window.applyColor = applyColor;
    window.setDesign = setDesign;
    window.setDesignColor = setDesignColor;

    loadShirt("polo");

  }, [selectedDesign, uploadedImage]);

  const handleAddToCart = () => {
    const canvas = document.getElementById("tshirtCanvas");
    const imageData = canvas.toDataURL("image/png");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
      name: "Custom T-Shirt",
      type: selectedType,
      price: 5000,
      size: "M",
      quantity: 1,
      color: selectedColor,
      design: selectedDesign,
      image: imageData,
      isCustom: true
    };

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart 🛒");
  };
  const handleClear = () => {
  setSelectedType("polo");
  setSelectedDesign(null);
  setSelectedColor("#ffffff");
  setSelectedSize("M");
  setUploadedImage(null);

    // reset UI buttons
    document.querySelectorAll(".design-item").forEach(el =>
      el.classList.remove("active")
    );

    document.getElementById("btnPolo")?.classList.add("active");
    document.getElementById("btnRound")?.classList.remove("active");

    document.getElementById("bodyBtn")?.classList.add("active");
    document.getElementById("sleeveBtn")?.classList.remove("active");

    // reload shirt
    window.setType("polo");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={lionLogo} alt="logo" />
        </div>

        <div className="search">
          <FiSearch className="search-icon" />
          <input placeholder="Find a product" />
        </div>

        <div className="icons">
          <div className="icon-box" onClick={() => navigate("/wishlist")}>
            <FaHeart />
            <span className="badge">{wishlist.length}</span>
          </div>

          <div className="icon-box" onClick={() => navigate("/profile")}>
            <FaUser />
          </div>

          <div className="divider"></div>

          <div className="icon-box" onClick={() => navigate("/cart")}>
            <BsBag />
            <span className="badge">{cart.length}</span>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="menu">
        <span onClick={() => navigate("/products")}>ALL</span>
        <span onClick={() => navigate("/products?type=polo")}>POLO</span>
        <span onClick={() => navigate("/products?type=round")}>ROUND NECK</span>
        <span onClick={() => navigate("/customize")}>CUSTOMIZE</span>
      </div>

      <div className="container">
        <div className="preview-box">
          <canvas id="tshirtCanvas"></canvas>
        </div>

        <div className="panel">

          <h3>T-Shirt Type</h3>
          <button id="btnPolo" className="active" onClick={() => window.setType("polo")}>Polo</button>
          <button id="btnRound" onClick={() => window.setType("round")}>Round Neck</button>

          <h3>Paint Area</h3>
          <button id="bodyBtn" className="active" onClick={() => window.setMode("body")}>Body</button>
          <button id="sleeveBtn" onClick={() => window.setMode("sleeves")}>Sleeves</button>

          <h3>Colors</h3>
          {[
            "#000000","#ffffff","#ff0000","#0000ff","#008000","#800000",
            "#0f2f1f","#808080","#000080","#800080","#ffc0cb","#ffa500"
          ].map((color) => (
            <div key={color} className="color-box"
              style={{ background: color }}
              onClick={() => window.applyColor(color)} />
          ))}

          {/* ✅ UPDATED DESIGN GRID */}
          <h3>Design</h3>
          <div className="design-grid">
            {["star","dots","circle","triangle","square","diamond","flower","sun","ring","waves","hex","plus"]
              .map((d) => (
                <div
                  key={d}
                  id={`design_${d}`}
                  className={`design-item ${selectedDesign === d ? "active" : ""}`}
                  onClick={() => window.setDesign(d)}
                >
                  {renderIcon(d)}
                </div>
              ))}
          </div>

          <h3>Design Color</h3>
          <div className="design-colors">
            {[
              "#000000", "#ffffff", "#ff0000", "#0000ff", "#008000",
              "#800000", "#ffa500", "#800080", "#ffc0cb", "#00ffff",
              "#ffd700", "#0f2f1f"
            ].map((color) => (
              <div
                key={color}
                className="color-box"
                style={{ background: color }}
                onClick={() => window.setDesignColor(color)}
              ></div>
            ))}
          </div>
          <h3>Upload Design</h3>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button className="clear-btn" onClick={handleClear}>Clear All </button>
          <h3>Size</h3>

          <div className="size-box">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`size-item ${selectedSize === size ? "active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>

          <div className="price">Price: ₹5000</div>

          <button className="order" onClick={handleAddToCart}>
            Add to Cart
          </button>

        </div>
      </div>
    </>
  );
}