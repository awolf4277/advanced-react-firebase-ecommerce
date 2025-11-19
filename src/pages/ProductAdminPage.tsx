import React, { useState } from "react";
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from "../api/productsFirebase";
import type { Product } from "../types/product";

const emptyForm: Omit<Product, "id"> = {
  title: "",
  description: "",
  price: 0,
  category: "",
  image: "",
  createdAt: undefined
};

const ProductAdminPage: React.FC = () => {
  const { data, isLoading, isError, error } = useProductsQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return;

    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      category: form.category,
      image: form.image
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      createdAt: p.createdAt
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <section>
      <h2>Product Management</h2>
      <p>Create, update, or delete products stored in Firestore.</p>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) || 0 })
          }
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingId ? "Update Product" : "Create Product"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      <h3>Existing Products</h3>

      {isLoading && <p>Loading products…</p>}
      {isError && <p>Error: {(error as Error).message}</p>}
      {!isLoading && data && data.length === 0 && <p>No products yet.</p>}

      <ul className="admin-product-list">
        {data?.map((p) => (
          <li key={p.id}>
            <span>
              <strong>{p.title}</strong> · ${p.price.toFixed(2)} · {p.category}
            </span>
            <div className="admin-product-actions">
              <button onClick={() => startEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductAdminPage;
