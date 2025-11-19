import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/authContext";
import { fetchOrdersForUser } from "../services.firestore";
import type { Order } from "../types";

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOrdersForUser(user.uid);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) return <p>You must be logged in to view your orders.</p>;
  if (loading) return <p>Loading your orders…</p>;
  if (error) return <p style={{ color: "#f97373" }}>{error}</p>;

  if (!orders.length) {
    return <p>You have no orders yet. Place an order from the cart.</p>;
  }

  const selectedOrder =
    orders.find((o) => o.id === selectedId) || orders[0];

  return (
    <section>
      <h2>Your Orders</h2>
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr",
          gap: "1rem"
        }}
      >
        <ul style={{ listStyle: "none", paddingRight: "1rem" }}>
          {orders.map((o) => (
            <li
              key={o.id}
              onClick={() => setSelectedId(o.id)}
              style={{
                padding: "0.3rem 0",
                cursor: "pointer",
                fontWeight: o.id === selectedOrder.id ? 600 : 400
              }}
            >
              <span>
                Order #{o.id.slice(0, 6)} ·{" "}
                {new Date(o.createdAt).toLocaleString()} · $
                {o.total.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div>
          <h3>
            Order #{selectedOrder.id.slice(0, 8)} · $
            {selectedOrder.total.toFixed(2)}
          </h3>
          <p>
            Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
          </p>
          <ul style={{ listStyle: "none", marginTop: "0.75rem" }}>
            {selectedOrder.items.map((i) => (
              <li
                key={i.productId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  padding: "0.25rem 0",
                  borderBottom: "1px solid #1f2937"
                }}
              >
                <span>{i.title}</span>
                <span>x{i.quantity}</span>
                <span>
                  ${(i.price * i.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;

