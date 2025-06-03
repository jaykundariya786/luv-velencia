
import React, { createContext, useContext, ReactNode } from 'react';
import useShoppingBag, { ShoppingBagItem } from '../hooks/use-shopping-bag';

interface ShoppingBagContextType {
  items: ShoppingBagItem[];
  addItem: (item: Omit<ShoppingBagItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const ShoppingBagContext = createContext<ShoppingBagContextType | undefined>(undefined);

export const useShoppingBagContext = () => {
  const context = useContext(ShoppingBagContext);
  if (!context) {
    throw new Error('useShoppingBagContext must be used within a ShoppingBagProvider');
  }
  return context;
};

interface ShoppingBagProviderProps {
  children: ReactNode;
}

export const ShoppingBagProvider: React.FC<ShoppingBagProviderProps> = ({ children }) => {
  const shoppingBag = useShoppingBag();

  return (
    <ShoppingBagContext.Provider value={shoppingBag}>
      {children}
    </ShoppingBagContext.Provider>
  );
};
