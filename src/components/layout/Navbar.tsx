import React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCategory, setSearch } from "../../store/uiSlice";

const categories = ["all"];

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { category, search } = useAppSelector((s) => s.ui);

  return (
    <nav className="navbar">
      <select
        value={category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c === "all" ? "All categories" : c}
          </option>
        ))}
      </select>

      <input
        type="search"
        placeholder="Search products…"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
    </nav>
  );
};

export default Navbar;
