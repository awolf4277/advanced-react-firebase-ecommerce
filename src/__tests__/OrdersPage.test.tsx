import React from "react";
import { render, screen } from "@testing-library/react";
import OrdersPage from "../pages/OrdersPage";

// Mock auth so we can simulate "not logged in"
jest.mock("../firebase/authContext", () => ({
  useAuth: () => ({ user: null, loading: false })
}));

// Mock Firestore services so Jest NEVER loads firebaseConfig/import.meta
jest.mock("../services.firestore", () => ({
  fetchOrdersForUser: jest.fn().mockResolvedValue([])
}));

describe("OrdersPage", () => {
  test("shows login message when user is not authenticated", () => {
    render(<OrdersPage />);

    expect(
      screen.getByText(/You must be logged in to view your orders/i)
    ).toBeInTheDocument();
  });
});
