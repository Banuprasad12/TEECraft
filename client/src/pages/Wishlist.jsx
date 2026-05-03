import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaHeart, FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import "../styles/wishlist.css";
import lionLogo from "../assets/lion.svg";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  return (
    <>
      {/* 🔥 NAVBAR */}
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
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

      {/* 🔥 WISHLIST */}
      <div className="wishlist-container">
        <h3>{wishlist.length} Item(s)</h3>

        {wishlist.length === 0 ? (
          <h2>No items in wishlist</h2>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div className="wishlist-card" key={item._id}>
                
                {/* 🗑 DELETE */}
                <FaTrash
                  className="delete-icon"
                  onClick={() => removeItem(item._id)}
                />

                {/* IMAGE */}
                <img
                  src={
                    item.image
                      ? `http://localhost:5000/uploads/${item.image}`
                      : "/default.png"
                  }
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "/default.png";
                  }}
                />

                {/* TEXT */}
                <h4>{item.name}</h4>
                <p className="price">MRP: ₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}