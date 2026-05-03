import { useNavigate } from "react-router-dom";
import lionLogo from "../assets/lion.svg";

import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();

  const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  return (
    <div className="navbar">

      {/* LOGO */}
      <div className="logo">
        <img src={lionLogo} alt="logo" />
      </div>

      {/* SEARCH */}
      <div className="search">
        <FiSearch className="search-icon" />
        <input placeholder="Find a product" />
      </div>

      {/* ICONS */}
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
          onClick={() => navigate("/profile")}
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
  );
}