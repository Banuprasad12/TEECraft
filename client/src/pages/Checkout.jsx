import { useState, useEffect } from "react";

export default function Checkout() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <div style={{ display: "flex", padding: "40px", gap: "40px" }}>

      {/* LEFT → FORM */}
      <div style={{ flex: 1 }}>
        <h2>Shipping Details</h2>

        <input placeholder="First Name" style={input} />
        <input placeholder="Last Name" style={input} />
        <input placeholder="Address" style={input} />
        <input placeholder="Zip Code" style={input} />
        <input placeholder="City" style={input} />
        <input placeholder="State" style={input} />
        <input placeholder="Phone Number" style={input} />

        <button style={btn}>Proceed to Payment</button>
      </div>

      {/* RIGHT → ORDER SUMMARY */}
      <div style={{ flex: 1, background: "#f5f5f5", padding: "20px" }}>
        <h3>Order Summary</h3>

        {cart.map((item, i) => (
          <div key={i} style={{ display: "flex", marginBottom: "20px" }}>
            
            {/* IMAGE */}
            <img
              src={
                item.isCustom
                  ? item.image
                  : `http://localhost:5000/uploads/${item.image}`
              }
              width="80"
              alt=""
            />

            {/* DETAILS */}
            <div style={{ marginLeft: "10px" }}>
              <p>{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Size: {item.size}</p>
              <p>₹{item.price}</p>
            </div>
          </div>
        ))}

        <hr />

        <h4>Total: ₹{getTotal()}</h4>
      </div>
    </div>
  );
}

// styles
const input = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px"
};

const btn = {
  marginTop: "20px",
  padding: "12px",
  background: "green",
  color: "white",
  border: "none",
  cursor: "pointer"
};