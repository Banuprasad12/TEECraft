import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Customize from "./pages/Customize";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";

import AdminRoute from "./AdminRoute"; // 🔥 import this
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        {/* 🔥 Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route path="/customize" element={<Customize />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;