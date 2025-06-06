import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ShoppingBagItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  color?: string;
  style?: string;
}

interface ShoppingBagState {
  items: ShoppingBagItem[];
}

const getInitialItems = (): ShoppingBagItem[] => {
  try {
    const stored = localStorage.getItem("shoppingBag");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading shopping bag from localStorage:", error);
  }

  // Return default items if nothing in localStorage
  return [
    {
      id: 1,
      name: "WASHED DENIM SHIRT WITH GG INSERT",
      price: 2250,
      image:
        "https://media.gucci.com/style/White_South_0_160_316x316/1731082815/815642_XDDCC_1130_001_100_0000_Light-Slim-fit-denim-pant-with-logo-detail.jpg",
      size: "50 IT",
      quantity: 1,
      color: "Blue",
    },
    {
      id: 2,
      name: "MEN'S GUCCI RE-WEB SNEAKER",
      price: 1150,
      image:
        "https://media.gucci.com/style/White_South_0_160_316x316/1742322704/832461_AAEW3_9045_001_100_0000_Light-Mens-Gucci-Re-Motion-sneaker.jpg",
      size: "9 US",
      quantity: 1,
      color: "White",
    },
  ];
};

const initialState: ShoppingBagState = {
  items: getInitialItems(),
};

const shoppingBagSlice = createSlice({
  name: "shoppingBag",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<
        Omit<ShoppingBagItem, "quantity"> & { quantity?: number }
      >
    ) => {
      const { quantity = 1, ...item } = action.payload;
      const existingIndex = state.items.findIndex(
        (existing) => existing.id === item.id && existing.size === item.size
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }

      localStorage.setItem("shoppingBag", JSON.stringify(state.items));
    },
    removeItem: (
      state,
      action: PayloadAction<{ id: number; size: string }>
    ) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size)
      );
      localStorage.setItem("shoppingBag", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; size: string; quantity: number }>
    ) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) => !(item.id === id && item.size === size)
          );
        } else {
          item.quantity = quantity;
        }
        localStorage.setItem("shoppingBag", JSON.stringify(state.items));
      }
    },
    clearBag: (state) => {
      state.items = [];
      localStorage.removeItem("shoppingBag");
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearBag } =
  shoppingBagSlice.actions;
export default shoppingBagSlice.reducer;
