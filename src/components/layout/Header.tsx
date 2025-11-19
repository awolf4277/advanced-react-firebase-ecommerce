import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import CartIcon from "../cart/CartIcon";
import { useAuth } from "../../firebase/authContext";

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-top">
        <Link to="/" className="logo">
          Advanced React E-Commerce
        </Link>
        <div className="header-right">
          <nav style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem" }}>
            <Link to="/orders">Orders</Link>
            <Link to="/manage-products">Manage Products</Link>
            <Link to="/profile">Profile</Link>
          </nav>
          {user ? (
            <div className="user-pill">
              {user.photoURL && <img src={user.photoURL} alt="avatar" />}
              <span>{user.displayName || user.email}</span>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
          <CartIcon />
        </div>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
