import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import type { Product } from "../types";

const TestCartComponent: React.FC = () => {
  const { total, addToCart } = useCart();

  const fakeProduct: Product = {
    id: "p1",
    title: "Test Product",
    description: "A product used for testing",
    price: 10,
    category: "test",
    image: ""
  };

  return (
    <div>
      <div data-testid="cart-total">Total: {total}</div>
      <button onClick={() => addToCart(fakeProduct)} data-testid="add-btn">
        Add Test Product
      </button>
    </div>
  );
};

describe("CartContext", () => {
  test("initial total is 0", () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    expect(screen.getByTestId("cart-total")).toHaveTextContent("Total: 0");
  });

  test("integration: cart total updates when adding a product", () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addBtn = screen.getByTestId("add-btn");

    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    expect(screen.getByTestId("cart-total")).toHaveTextContent("Total: 20");
  });
});
