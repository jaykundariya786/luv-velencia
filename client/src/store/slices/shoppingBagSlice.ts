
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ShoppingBagItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  color?: string;
}

interface ShoppingBagState {
  items: ShoppingBagItem[];
}

const initialState: ShoppingBagState = {
  items: JSON.parse(localStorage.getItem('shoppingBag') || '[]'),
};

const shoppingBagSlice = createSlice({
  name: 'shoppingBag',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<ShoppingBagItem, 'quantity'> & { quantity?: number }>) => {
      const { quantity = 1, ...item } = action.payload;
      const existingIndex = state.items.findIndex(
        existing => existing.id === item.id && existing.size === item.size
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }

      localStorage.setItem('shoppingBag', JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<{ id: number; size: string }>) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(item => !(item.id === id && item.size === size));
      localStorage.setItem('shoppingBag', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; size: string; quantity: number }>) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(item => item.id === id && item.size === size);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => !(item.id === id && item.size === size));
        } else {
          item.quantity = quantity;
        }
        localStorage.setItem('shoppingBag', JSON.stringify(state.items));
      }
    },
    clearBag: (state) => {
      state.items = [];
      localStorage.removeItem('shoppingBag');
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearBag } = shoppingBagSlice.actions;
export default shoppingBagSlice.reducer;
