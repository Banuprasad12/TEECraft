import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    console.log("SENDING:", data);

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/auth/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("SUCCESS:", res.data);

      alert("Registered successfully");

      // ✅ better than window.location
      navigate("/");
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Register</h2>

      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Name"
          value={data.name}
          required
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={data.email}
          required
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          required
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </>
  );
}