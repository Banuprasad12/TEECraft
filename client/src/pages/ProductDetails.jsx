import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/productDetails.css";

// 🔥 NAVBAR IMPORTS
import lionLogo from "../assets/lion.svg";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  if (!product) return <h2>Loading...</h2>;

  return (
    <>
      {/* 🔥 NAVBAR */}
      <div className="navbar">
        <div className="logo">
          <img src={lionLogo} alt="logo" />
        </div>

        <div className="search">
          <FiSearch className="search-icon" />
          <input placeholder="Find a product" />
        </div>

        <div className="icons">

          <div
            className="icon-box"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart />
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </div>

          <div
            className="icon-box"
            onClick={() => navigate("/profile")}
          >
            <FaUser />
          </div>

          <div className="divider"></div>

          <div
            className="icon-box"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingBag />
            {cart.length > 0 && (
              <span className="badge">{cart.length}</span>
            )}
          </div>

        </div>
      </div>

      {/* 🔥 MENU */}
      <div className="menu">
        <span onClick={() => navigate("/products")}>ALL</span>
        <span onClick={() => navigate("/products?type=polo")}>POLO</span>
        <span onClick={() => navigate("/products?type=round")}>
          ROUND NECK
        </span>
        <span onClick={() => navigate("/customize")}>CUSTOMIZE</span>
      </div>

      {/* 🔥 PRODUCT DETAILS */}
      <div className="pd-container">

        {/* LEFT */}
        <div className="pd-left">
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
          />
        </div>

        {/* RIGHT */}
        <div className="pd-right">

          <h2 className="pd-title">{product.name}</h2>

          <p className="pd-sub">
            Men - {product.type} - Premium Cotton
          </p>

          <h3 className="pd-price">
            MRP: ₹{product.price}
          </h3>

          <p className="pd-tax">(Inclusive of all taxes)</p>

          {/* SIZE */}
          <div className="pd-size">
            <h4>Size</h4>

            <div className="sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={
                    selectedSize === size ? "size active" : "size"
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="pd-buttons">

            <button
              className="add"
              onClick={() => {
                if (!selectedSize) {
                  alert("Select size");
                  return;
                }

                const cartItem = {
                  ...product,
                  size: selectedSize,
                  quantity: 1
                };

                let cart =
                  JSON.parse(localStorage.getItem("cart")) || [];

                cart.push(cartItem);

                localStorage.setItem("cart", JSON.stringify(cart));

                alert("Added to cart 🛒");
              }}
            >
              ADD TO CART
            </button>

            <button className="buy">
              BUY NOW
            </button>

          </div>

        </div>
      </div>
    </>
  );
}