import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleCart } from "../../store/uiSlice";

const CartIcon: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button className="cart-icon" onClick={() => dispatch(toggleCart())}>
      🛒
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  );
};

export default CartIcon;
