import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { useAuth } from "./firebase/authContext";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";

const LoginPage: React.FC = () => {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  if (loading) return <p>Checking auth…</p>;

  if (user) {
    return (
      <section>
        <h2>Account</h2>
        <p>Signed in as {user.email}</p>
        <button onClick={logout}>Logout</button>
      </section>
    );
  }

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setWorking(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password);
      }
    } catch (err: any) {
      setError(err.message || "Auth failed");
    } finally {
      setWorking(false);
    }
  };

  return (
    <section>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: 320
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />
        {error && <p style={{ color: "#f97373" }}>{error}</p>}
        <button type="submit" disabled={working}>
          {working ? "Working…" : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <button
        type="button"
        style={{ marginTop: "0.75rem" }}
        onClick={() =>
          setMode(mode === "login" ? "register" : "login")
        }
      >
        Switch to {mode === "login" ? "Register" : "Login"}
      </button>
    </section>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "1.5rem"
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem"
        }}
      >
        <h1>Advanced React Firebase E-Commerce ✅</h1>
        <nav
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center"
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/login">Login</Link>
          {user && (
            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              {user.email}
            </span>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <section>
                <h2>404</h2>
                <p>Page not found.</p>
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;



