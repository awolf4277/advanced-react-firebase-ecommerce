import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  category: string;
  search: string;
  cartOpen: boolean;
}

const initialState: UiState = {
  category: "all",
  search: "",
  cartOpen: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
    closeCart(state) {
      state.cartOpen = false;
    }
  }
});

export const { setCategory, setSearch, toggleCart, closeCart } = uiSlice.actions;
export default uiSlice.reducer;
