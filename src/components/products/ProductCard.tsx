import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        {product.image && <img src={product.image} alt={product.title} />}
      </Link>
      <div className="product-body">
        <h3 title={product.title}>{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button
          onClick={() => dispatch(addToCart({ product }))}
          className="btn-primary"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
