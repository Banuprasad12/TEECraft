import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    type: "polo",
    price: "",
    qty: "",
    desc: "",
    image: null
  });

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  // 🔹 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 SUBMIT (ADD + UPDATE)
  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("type", form.type);
    data.append("price", form.price);
    data.append("qty", form.qty);
    data.append("desc", form.desc);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${BASE_URL}/api/products/${editId}`, data);
        setEditId(null);
      } else {
        // ADD
        await axios.post(`${BASE_URL}/api/products`, data);
      }

      // RESET FORM
      setForm({
        name: "",
        type: "polo",
        price: "",
        qty: "",
        desc: "",
        image: null
      });

      fetchProducts();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 DELETE
  const deleteProduct = async (id) => {
    if (window.confirm("Delete product?")) {
      try {
        await axios.delete(`${BASE_URL}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 🔹 EDIT
  const editProduct = (p) => {
    setForm({
      name: p.name,
      type: p.type,
      price: p.price,
      qty: p.qty,
      desc: p.desc,
      image: null
    });

    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

      {/* 🔹 FORM */}
      <div style={formCard}>
        <h3>{editId ? "Edit Product" : "Add Product"}</h3>

        <form onSubmit={submit}>
          <input
            value={form.name}
            placeholder="Name"
            required
            style={inputStyle}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.type}
            style={inputStyle}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="polo">Polo</option>
            <option value="round">Round Neck</option>
          </select>

          <input
            value={form.price}
            placeholder="Price"
            required
            style={inputStyle}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <input
            value={form.qty}
            placeholder="Qty"
            required
            style={inputStyle}
            onChange={e => setForm({ ...form, qty: e.target.value })}
          />

          <textarea
            value={form.desc}
            placeholder="Description"
            style={inputStyle}
            onChange={e => setForm({ ...form, desc: e.target.value })}
          />

          <input
            type="file"
            style={inputStyle}
            onChange={e => setForm({ ...form, image: e.target.files[0] })}
          />

          <button style={btnStyle}>
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* 🔹 TABLE */}
      <h3>Products</h3>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thtd}>ID</th>
            <th style={thtd}>Name</th>
            <th style={thtd}>Type</th>
            <th style={thtd}>Price</th>
            <th style={thtd}>Qty</th>
            <th style={thtd}>Image</th>
            <th style={thtd}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, index) => (
            <tr key={p._id} style={{ textAlign: "center" }}>
              <td style={thtd}>{index + 1}</td>
              <td style={thtd}>{p.name}</td>
              <td style={thtd}>{p.type}</td>
              <td style={thtd}>{p.price}</td>
              <td style={thtd}>{p.qty}</td>

              <td style={thtd}>
                {p.image && (
                  <img
                    src={`${BASE_URL}/uploads/${p.image}`}
                    width="50"
                    alt=""
                  />
                )}
              </td>

              <td style={thtd}>
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => editProduct(p)}
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* 🔥 STYLES */

const containerStyle = {
  padding: "20px",
  fontFamily: "Arial",
  color: "#222",
  minHeight: "100vh"
};

const formCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  marginBottom: "30px"
};

const inputStyle = {
  display: "block",
  margin: "10px 0",
  padding: "8px",
  width: "100%",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const btnStyle = {
  padding: "10px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "red",
  color: "white",
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
};

const theadStyle = {
  background: "#333",
  color: "white"
};

const thtd = {
  padding: "10px",
  border: "1px solid #ddd"
};