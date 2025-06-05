import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/slices/shoppingBagSlice';

export default function SavedItems() {
  const navigate = useNavigate();
  //const { addItem } = useShoppingBagContext();
  const dispatch = useDispatch();
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      name: 'GG Denim Sneakers',
      price: 890.00,
      image: 'https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1679046547/771932_UUEG0_4645_001_100_0000_Light-GG-denim-sneaker.jpg',
      category: 'Shoes',
      savedDate: '2025-01-10'
    },
    {
      id: 2,
      name: 'Washed Denim Shirt with GG Insert',
      price: 2250.00,
      image: 'https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg',
      category: 'Ready-to-Wear',
      savedDate: '2025-01-08'
    },
    {
      id: 3,
      name: 'Gucci Staffa Long Pendant Necklace',
      price: 1890.00,
      image: 'https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1679046547/771932_UUEG0_4645_001_100_0000_Light-GG-denim-sneaker.jpg',
      category: 'Jewelry',
      savedDate: '2025-01-05'
    }
  ]);

  const handleRemoveItem = (id: number) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const handleAddToBag = (item: any) => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: 'One Size',
    }));
  };

  const handleViewProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/account')}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-light uppercase tracking-wider text-black">
            Saved Items
          </h1>
          <span className="text-gray-500">({savedItems.length} items)</span>
        </div>

        {/* Items Grid */}
        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedItems.map((item) => (
              <div key={item.id} className="group">
                <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4">
                  {/* Product Image */}
                  <div 
                    className="aspect-square cursor-pointer"
                    onClick={() => handleViewProduct(item.id)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Remove Heart Icon */}
                  <Button
                    onClick={() => handleRemoveItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </Button>

                  {/* Quick Actions */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={() => handleAddToBag(item)}
                      className="w-full bg-black text-white hover:bg-gray-800 text-sm py-2"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Bag
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {item.category}
                  </div>
                  <h3 
                    className="font-medium text-black text-sm leading-tight cursor-pointer hover:underline"
                    onClick={() => handleViewProduct(item.id)}
                  >
                    {item.name}
                  </h3>
                  <div className="text-black">
                    ${item.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Saved on {new Date(item.savedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleAddToBag(item)}
                    className="flex-1 bg-black text-white hover:bg-gray-800 text-sm"
                  >
                    Add to Bag
                  </Button>
                  <Button
                    onClick={() => handleRemoveItem(item.id)}
                    variant="outline"
                    size="sm"
                    className="p-3 border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-black mb-3">No saved items yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing and save items you love to keep track of them here. 
              You can add items to your wishlist by clicking the heart icon.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-black text-white hover:bg-gray-800 px-8"
            >
              Start Shopping
            </Button>
          </div>
        )}

        {/* Actions Bar */}
        {savedItems.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  savedItems.forEach(item => handleAddToBag(item));
                }}
                className="bg-black text-white hover:bg-gray-800 px-8"
              >
                Add All to Bag
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-black text-black hover:bg-gray-50 px-8"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}