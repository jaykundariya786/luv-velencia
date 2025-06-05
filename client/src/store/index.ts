import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import shoppingBagSlice from './slices/shoppingBagSlice';
import productsSlice from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    shoppingBag: shoppingBagSlice,
    products: productsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;