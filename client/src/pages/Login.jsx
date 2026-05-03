import "../styles/login.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      console.log("SENDING:", data);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      console.log("RESPONSE:", res.data);

      const user = res.data;

      // store user
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 role-based redirect
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }

    } catch (err) {
      console.log(err);
      alert("Invalid login");
    }
  };

  return (
    <>
      <div className="bg"></div>

      <div className="login-card">

  

        <h2>LOGIN</h2>

        <form onSubmit={submit}>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="buttons">
            <button type="submit" className="btn login-btn">
              Login
            </button>

            <Link to="/register" className="btn create-btn">
              Create Account
            </Link>
          </div>

        </form>


      </div>
    </>
  );
}