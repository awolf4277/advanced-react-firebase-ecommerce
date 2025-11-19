import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services.firestore";
import type { Product } from "../types";
import { useCart } from "../contexts/CartContext";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p style={{ color: "#f97373" }}>{error}</p>;

  if (!products.length) {
    return (
      <section>
        <h2>Home</h2>
        <p>No products yet. Add some in the Admin page.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Product Catalog</h2>
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem"
        }}
      >
        {products.map((p) => (
          <article
            key={p.id}
            style={{
              border: "1px solid #1f2937",
              borderRadius: "0.75rem",
              padding: "0.75rem"
            }}
          >
            {p.image && (
              <div
                style={{
                  height: "160px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem"
                }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
            )}
            <h3
              style={{ fontSize: "0.95rem", marginBottom: "0.25rem" }}
              title={p.title}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>{p.category}</p>
            <p style={{ marginTop: "0.25rem", fontWeight: 700 }}>
              ${p.price.toFixed(2)}
            </p>
            <button
              style={{
                marginTop: "0.5rem",
                borderRadius: "999px",
                padding: "0.3rem 0.8rem",
                border: "none",
                background: "#22c55e",
                color: "#022c22",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
              onClick={() => addToCart(p)}
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
