import "../styles/products.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import lionLogo from "../assets/lion.svg";
// 🔥 ICONS
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Profile from "./Profile";

export default function Products() {
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  // 🔥 get type from URL
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  // 🔥 fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔥 filter logic
  const filteredProducts = type
    ? products.filter((p) => p.type === type)
    : products;

  // 🔥 counts
  const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  return (
    <>
      {/* NAVBAR */}
        <div className="navbar">
          <div className="logo">
          <img src={lionLogo} alt="logo" />
        </div>
        {showProfile && (
        <div
          className="profile-overlay"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="profile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <Profile />
          </div>
        </div>
      )}
              <div className="search">
          <FiSearch className="search-icon" />
          <input placeholder="Find a product" />
        </div>


        <div className="icons">

          {/* ❤️ Wishlist */}
          <div
            className="icon-box"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart />
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </div>

          {/* 👤 Profile */}
          <div
            className="icon-box"
            onClick={(e) => {
            e.stopPropagation();
            setShowProfile(true);
          }}
          >
            <FaUser />
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* 🛒 Cart */}
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

      {/* MENU */}
      <div className="menu">
        <Link to="/products">ALL</Link>
        <Link to="/products?type=polo">POLO</Link>
        <Link to="/products?type=round">ROUND NECK</Link>
        <Link to="/customize">CUSTOMIZE</Link>
      </div>

      {/* PRODUCTS */}
      <div className="products">
        {filteredProducts.length === 0 ? (
          <h2 style={{ textAlign: "center", width: "100%" }}>
            No products found
          </h2>
        ) : (
          filteredProducts.map((p) => (
            
            <div
              className="card"
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {/* ❤️ WISHLIST BUTTON */}
              <button
                className="wishlist-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  let wishlist =
                    JSON.parse(localStorage.getItem("wishlist")) || [];

                  const exists = wishlist.find(
                    (item) => item._id === p._id
                  );

                  if (!exists) {
                    wishlist.push(p);
                    localStorage.setItem(
                      "wishlist",
                      JSON.stringify(wishlist)
                    );
                    alert("Added to wishlist ❤️");
                  } else {
                    alert("Already in wishlist");
                  }
                }}
              >
                ❤️
              </button>

              

              
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                className="product-img"
                alt={p.name}
              />

              <h3>{p.name}</h3>
              <p>{p.desc || "Premium Cotton T-Shirt"}</p>

              <p className="price">₹{p.price}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}