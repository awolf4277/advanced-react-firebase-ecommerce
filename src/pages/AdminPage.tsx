import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/authContext";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services.firestore";
import type { Product } from "../types";

const emptyForm: Omit<Product, "id"> = {
  title: "",
  description: "",
  price: 0,
  category: "",
  image: ""
};

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple admin rule: only this email can manage products (change to your own)
 const isAdmin = user?.email === "awolf4277@gmail.com";


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

  if (!user) return <p>You must be logged in to manage products.</p>;
  if (!isAdmin)
    return (
      <p>You are logged in, but not an admin (change the admin email in code).</p>
    );

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return;
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      const data = await fetchProducts();
      setProducts(data);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts(await fetchProducts());
  };

  return (
    <section>
      <h2>Admin: Product Management</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "0.75rem",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: Number(e.target.value) || 0
            })
          }
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        {error && <p style={{ color: "#f97373" }}>{error}</p>}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving…"
              : editingId
              ? "Update Product"
              : "Create Product"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "1rem 0" }} />

      <h3>Existing Products</h3>
      {loading && <p>Loading…</p>}
      <ul style={{ listStyle: "none", marginTop: "0.5rem" }}>
        {products.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.3rem 0",
              borderBottom: "1px solid #1f2937"
            }}
          >
            <span>
              <strong>{p.title}</strong> · ${p.price.toFixed(2)} ·{" "}
              {p.category}
            </span>
            <span style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => startEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPage;
