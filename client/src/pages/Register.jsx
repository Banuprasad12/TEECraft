import axios from "axios";
import { useState } from "react";
import BASE_URL from "../config";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    console.log("SENDING:", data); // 🔥 DEBUG

    await axios.post(`${BASE_URL}/api/auth/register`, data);

    alert("Registered successfully");
    window.location.href = "/";
  };

  return (
    <>
      <h2>Register</h2>

      <form onSubmit={submit}>
        {/* ✅ FIXED */}
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

        <button type="submit">Register</button>
      </form>
    </>
  );
}