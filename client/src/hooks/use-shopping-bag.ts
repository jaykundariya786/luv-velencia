
import { useAppSelector, useAppDispatch } from './redux';
import { addItem, removeItem, updateQuantity } from '@/store/slices/shoppingBagSlice';

const useShoppingBag = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.shoppingBag);

  const addItemToCart = (item: any) => {
    dispatch(addItem(item));
  };

  const removeItemFromCart = (id: number, size: string) => {
    dispatch(removeItem({ id, size }));
  };

  const updateItemQuantity = (id: number, size: string, quantity: number) => {
    dispatch(updateQuantity({ id, size, quantity }));
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    items,
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    updateQuantity: updateItemQuantity,
    getTotalItems,
    getTotalPrice
  };
};

export default useShoppingBag;
