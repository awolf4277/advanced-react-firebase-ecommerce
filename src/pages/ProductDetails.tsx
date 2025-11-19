import React from "react";
import { useParams } from "react-router-dom";
import { useProductQuery } from "../api/productsFirebase";
import { addToCart } from "../store/cartSlice";
import { useAppDispatch } from "../store/hooks";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const productId = id || "";
  const { data, isLoading, isError, error } = useProductQuery(productId);
  const dispatch = useAppDispatch();

  if (!productId) return <p>Invalid product.</p>;
  if (isLoading) return <p>Loading product…</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;
  if (!data) return <p>Product not found.</p>;

  return (
    <section className="product-detail">
      <div className="product-detail-image">
        {data.image && <img src={data.image} alt={data.title} />}
      </div>
      <div className="product-detail-info">
        <h2>{data.title}</h2>
        <p className="product-category">{data.category}</p>
        <p className="product-price">${data.price.toFixed(2)}</p>
        <p className="product-description">{data.description}</p>
        <button
          className="btn-primary"
          onClick={() => dispatch(addToCart({ product: data }))}
        >
          Add to cart
        </button>
      </div>
    </section>
  );
};

export default ProductDetails;
