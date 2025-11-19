import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeCart } from "../../store/uiSlice";
import { removeFromCart, updateQuantity, clearCart } from "../../store/cartSlice";

const CartSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.cartOpen);
  const items = useAppSelector((s) => s.cart.items);

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  if (!open) return null;

  return (
    <aside className="cart-drawer">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={() => dispatch(closeCart())}>✕</button>
      </div>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-items">
          {items.map((item) => (
            <li key={item.product.id} className="cart-item">
              {item.product.image && (
                <img src={item.product.image} alt={item.product.title} />
              )}
              <div className="cart-item-info">
                <h4>{item.product.title}</h4>
                <p>${item.product.price.toFixed(2)}</p>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: item.product.id,
                        quantity: Number(e.target.value) || 1
                      })
                    )
                  }
                />
                <button
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-footer">
        <p>Total: ${total.toFixed(2)}</p>
        <div className="cart-actions">
          <button onClick={() => dispatch(clearCart())}>Clear cart</button>
          <Link to="/cart" onClick={() => dispatch(closeCart())}>
            Go to checkout
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default CartSummary;
