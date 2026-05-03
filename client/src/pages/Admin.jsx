import { useEffect, useState } from "react";
import axios from "axios";

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
  const [editId, setEditId] = useState(null); // 🔥 NEW

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 SUBMIT (ADD + UPDATE)
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

    if (editId) {
      // 🔥 UPDATE
      await axios.put(
        `http://localhost:5000/api/products/${editId}`,
        data
      );
      setEditId(null);
    } else {
      // 🔥 ADD
      await axios.post("http://localhost:5000/api/products", data);
    }

    // 🔥 RESET FORM
    setForm({
      name: "",
      type: "polo",
      price: "",
      qty: "",
      desc: "",
      image: null
    });

    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete product?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  // 🔥 EDIT FUNCTION
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

    // scroll up
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      color: "#222",
      minHeight: "100vh"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

      {/* 🔹 FORM */}
      <div style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h3>{editId ? "Edit Product" : "Add Product"}</h3>

        <form onSubmit={submit}>
          <input
            value={form.name}
            placeholder="Name"
            required
            style={inputStyle}
            onChange={e => setForm({...form, name: e.target.value})}
          />

          <select
            value={form.type}
            style={inputStyle}
            onChange={e => setForm({...form, type: e.target.value})}
          >
            <option value="polo">Polo</option>
            <option value="round">Round Neck</option>
          </select>

          <input
            value={form.price}
            placeholder="Price"
            required
            style={inputStyle}
            onChange={e => setForm({...form, price: e.target.value})}
          />

          <input
            value={form.qty}
            placeholder="Qty"
            required
            style={inputStyle}
            onChange={e => setForm({...form, qty: e.target.value})}
          />

          <textarea
            value={form.desc}
            placeholder="Description"
            style={inputStyle}
            onChange={e => setForm({...form, desc: e.target.value})}
          />

          <input
            type="file"
            style={inputStyle}
            onChange={e => setForm({...form, image: e.target.files[0]})}
          />

          <button style={btnStyle}>
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* 🔹 TABLE */}
      <h3>Products</h3>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <thead style={{ background: "#333", color: "white" }}>
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
                    src={`http://localhost:5000/uploads/${p.image}`}
                    width="50"
                    alt=""
                  />
                )}
              </td>

              <td style={thtd}>
                {/* 🔥 EDIT */}
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => editProduct(p)}
                >
                  Edit
                </button>

                {/* 🔥 DELETE */}
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

// 🔥 STYLES
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

const thtd = {
  padding: "10px",
  border: "1px solid #ddd"
};