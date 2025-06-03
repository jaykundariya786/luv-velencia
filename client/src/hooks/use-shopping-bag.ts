
import { useState } from 'react';

export interface ShoppingBagItem {
  id: number;
  name: string;
  price: number;
  image: string;
  style: string;
  quantity: number;
  size: string;
}

const useShoppingBag = () => {
  const [items, setItems] = useState<ShoppingBagItem[]>([
    {
      id: 1,
      name: "WASHED DENIM SHIRT WITH GG INSERT",
      price: 2250,
      image: "https://media.gucci.com/style/White_South_0_160_316x316/1731082815/815642_XDDCC_1130_001_100_0000_Light-Slim-fit-denim-pant-with-logo-detail.jpg",
      style: "835220 XDDCY 4452",
      quantity: 1,
      size: "50 IT"
    },
    {
      id: 2,
      name: "MEN'S GUCCI RE-WEB SNEAKER",
      price: 1150,
      image: "https://media.gucci.com/style/White_South_0_160_316x316/1742322704/832461_AAEW3_9045_001_100_0000_Light-Mens-Gucci-Re-Motion-sneaker.jpg",
      style: "834708 FAEVU 4645",
      quantity: 1,
      size: "9 US"
    }
  ]);

  const addItem = (item: Omit<ShoppingBagItem, 'quantity'> & { quantity?: number }) => {
    const existingItem = items.find(bagItem => 
      bagItem.id === item.id && bagItem.size === item.size
    );

    if (existingItem) {
      setItems(items.map(bagItem =>
        bagItem.id === item.id && bagItem.size === item.size
          ? { ...bagItem, quantity: bagItem.quantity + (item.quantity || 1) }
          : bagItem
      ));
    } else {
      setItems([...items, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  const removeItem = (id: number, size: string) => {
    setItems(items.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    
    setItems(items.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice
  };
};

export default useShoppingBag;
