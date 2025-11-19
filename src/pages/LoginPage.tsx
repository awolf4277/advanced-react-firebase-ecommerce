import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../firebase/authContext";

const LoginPage: React.FC = () => {
  const { user, login, loginWithGoogle, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const handleLogin: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setWorking(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setWorking(false);
    }
  };

  if (loading) return <p>Checking auth…</p>;

  if (user) {
    return (
      <section className="login-page">
        <h2>Account</h2>
        <p>You are logged in as {user.displayName || user.email}.</p>
        <button className="btn-primary" onClick={logout}>
          Logout
        </button>
      </section>
    );
  }

  return (
    <section className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p style={{ color: "#f97373" }}>{error}</p>}
        <button className="btn-primary" type="submit" disabled={working}>
          {working ? "Logging in…" : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "0.75rem" }}>
        Don&apos;t have an account? <Link to="/register">Register here</Link>.
      </p>

      <hr style={{ margin: "1rem 0" }} />

      <button className="btn-primary" type="button" onClick={loginWithGoogle}>
        Continue with Google
      </button>
    </section>
  );
};

export default LoginPage;
