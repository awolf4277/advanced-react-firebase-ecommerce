import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "../../types/product";
import { useAppSelector } from "../../store/hooks";

interface Props {
  products: Product[];
}

const ProductGrid: React.FC<Props> = ({ products }) => {
  const { category, search } = useAppSelector((s) => s.ui);

  const filtered = products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!filtered.length) {
    return <p>No products match your filters.</p>;
  }

  return (
    <div className="product-grid">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
