import React from "react";
import { useProductsQuery } from "../api/productsFirebase";
import ProductGrid from "../components/products/ProductGrid";

const Home: React.FC = () => {
  const { data, isLoading, isError, error } = useProductsQuery();

  if (isLoading) return <p>Loading products…</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;
  if (!data || data.length === 0) {
    return (
      <section>
        <h2>Product Catalog</h2>
        <p>No products found. Add some in the Product Management page.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Product Catalog ({data.length})</h2>
      <ProductGrid products={data} />
    </section>
  );
};

export default Home;
