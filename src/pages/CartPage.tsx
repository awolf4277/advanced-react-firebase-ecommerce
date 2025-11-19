import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../firebase/authContext";
import { createOrder } from "../services.firestore";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart, toOrderItems } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!items.length) return;

    setSaving(true);
    setError(null);
    try {
      await createOrder({
        userId: user.uid,
        items: toOrderItems(),
        total
      });
      clearCart();
      navigate("/orders");
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Cart / Checkout</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", marginTop: "0.75rem" }}>
            {items.map((i) => (
              <li
                key={i.product.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "3fr 1fr 1fr 1fr",
                  gap: "0.5rem",
                  padding: "0.25rem 0",
                  borderBottom: "1px solid #1f2937"
                }}
              >
                <span>{i.product.title}</span>
                <span>${i.product.price.toFixed(2)}</span>
                <input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      i.product.id,
                      Number(e.target.value) || 1
                    )
                  }
                />
                <button onClick={() => removeFromCart(i.product.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: "0.75rem", fontWeight: 700 }}>
            Total: ${total.toFixed(2)}
          </p>
          {error && <p style={{ color: "#f97373" }}>{error}</p>}
          <button
            style={{ marginTop: "0.5rem" }}
            onClick={handleCheckout}
            disabled={saving}
          >
            {saving ? "Placing order…" : "Place order"}
          </button>
        </>
      )}
    </section>
  );
};

export default CartPage;
