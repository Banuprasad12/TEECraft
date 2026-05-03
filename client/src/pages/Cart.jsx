import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

// 🔥 ADD THESE IMPORTS (MISSING IN YOUR CODE)
import lionLogo from "../assets/lion.svg";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const increase = (i) => {
    const updated = [...cart];
    updated[i].quantity = (updated[i].quantity || 1) + 1;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decrease = (i) => {
    const updated = [...cart];
    if ((updated[i].quantity || 1) > 1) {
      updated[i].quantity -= 1;
    }
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (i) => {
    const updated = cart.filter((_, index) => index !== i);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

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

      {/* 🔥 CART */}
      <div className="cart-page">

        <h2 className="cart-heading">CART & OPTIONS</h2>

        <div className="cart-layout">

          {/* LEFT */}
          <div className="cart-left">

            <h3 className="section-title">SHOPPING CART ITEMS</h3>

            {cart.map((item, i) => (
              <div className="cart-card" key={i}>

                <img
                  className="product-img"
                  src={
                    item.isCustom
                      ? item.image
                      : `http://localhost:5000/uploads/${item.image}`
                  }
                  alt=""
                />

                <div className="product-info">
                  <h4 className="product-name">{item.name}</h4>
                  <p className="size">Size: {item.size}</p>
                  <p className="price">₹{item.price}</p>

                  <div className="qty">
                    <button onClick={() => decrease(i)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => increase(i)}>+</button>
                  </div>
                </div>

                <div className="actions">
                  <span className="wishlist">♡</span>
                  <span
                    className="delete"
                    onClick={() => removeItem(i)}
                  >
                    🗑
                  </span>
                </div>

              </div>
            ))}

            {/* PROMO */}
            <div className="box">
              <p>Apply a promo code</p>
              <div className="promo">
                <input placeholder="Enter promo code" />
                <button>APPLY</button>
              </div>
            </div>

            {/* POINTS */}
            <div className="box">
              <p>Redeem Points</p>
              <small>Your Total points are: 0</small>
              <div className="promo">
                <input placeholder="Enter points" />
                <button>Submit</button>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="cart-right">

            <h3>SUMMARY</h3>

            <div className="row">
              <span>Subtotal</span>
              <span>₹{getTotal()}</span>
            </div>

            <div className="row">
              <span>Shipping (Free)</span>
              <span>₹0</span>
            </div>

            <hr />

            <div className="row total">
              <span>Order Total</span>
              <span>₹{getTotal()}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      </div>
    </>
  );
}