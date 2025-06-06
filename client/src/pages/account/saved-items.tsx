
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Trash2, Star } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addItem } from '@/store/slices/shoppingBagSlice';

export default function SavedItems() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
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
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-white uppercase tracking-[0.4em] mb-4">
              SAVED ITEMS
            </h1>
            <p className="text-xl text-white/90 tracking-[0.2em] uppercase">
              {savedItems.length} {savedItems.length === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>
        </div>
        
        {/* Back Button */}
        <Button
          onClick={() => navigate('/account')}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">G</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {savedItems.length > 0 ? (
          <>
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light uppercase tracking-[0.3em] text-black mb-4">
                MY WISHLIST
              </h2>
              <div className="w-16 h-px bg-black mx-auto mb-8"></div>
              <p className="text-gray-600 tracking-[0.1em] uppercase text-sm">
                Curated pieces for your consideration
              </p>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {savedItems.map((item) => (
                <div key={item.id} className="border-2 border-gray-200 bg-white hover:border-gray-300 transition-all duration-300 group">
                  <div className="p-6">
                    {/* Product Image */}
                    <div 
                      className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer mb-6"
                      onClick={() => handleViewProduct(item.id)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-2">
                          {item.category}
                        </div>
                        <h3 
                          className="text-lg font-light text-black leading-tight cursor-pointer hover:underline uppercase tracking-[0.1em] line-clamp-2"
                          onClick={() => handleViewProduct(item.id)}
                        >
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="text-xl font-light text-black">
                        ${item.price.toLocaleString()}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-[0.15em]">
                        <Star className="w-3 h-3" />
                        <span>Saved {new Date(item.savedDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-green-600 uppercase tracking-[0.15em] font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Available</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                      <Button
                        onClick={() => handleAddToBag(item)}
                        className="w-full bg-black text-white hover:bg-gray-800 h-11 text-sm uppercase tracking-[0.15em] font-medium rounded-none transition-all duration-300"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Bag
                      </Button>
                      
                      <Button
                        onClick={() => handleRemoveItem(item.id)}
                        variant="outline"
                        className="w-full border-2 border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 h-11 text-sm uppercase tracking-[0.15em] font-medium rounded-none transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6 pt-8 border-t-2 border-gray-200">
              <Button
                onClick={() => {
                  savedItems.forEach(item => handleAddToBag(item));
                }}
                className="bg-black text-white hover:bg-gray-800 px-16 py-4 text-sm uppercase tracking-[0.15em] font-medium rounded-none transition-all duration-300"
              >
                Add All to Bag
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-2 border-black text-black hover:bg-gray-50 px-16 py-4 text-sm uppercase tracking-[0.15em] font-medium rounded-none transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light uppercase tracking-[0.3em] text-black mb-4">
                MY WISHLIST
              </h2>
              <div className="w-16 h-px bg-black mx-auto mb-12"></div>
            </div>

            <div className="border-2 border-gray-200 p-16 bg-white max-w-2xl mx-auto">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-8" />
              <h3 className="text-2xl font-light text-black mb-6 uppercase tracking-[0.2em]">
                No Saved Items Yet
              </h3>
              <p className="text-gray-600 mb-12 max-w-md mx-auto leading-relaxed tracking-[0.05em]">
                Start browsing our exquisite collections and save items you love to keep track of them here. 
                Create your personal wishlist by clicking the heart icon.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-black text-white hover:bg-gray-800 px-16 py-4 text-sm uppercase tracking-[0.15em] font-medium rounded-none transition-all duration-300"
              >
                Explore Collections
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Security Notice - Similar to Settings Page */}
        {savedItems.length > 0 && (
          <div className="mt-20 relative overflow-hidden">
            {/* Background with subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2220%22%20height=%2220%22%20viewBox=%220%200%2020%2020%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22%23d97706%22%20fill-opacity=%220.02%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
            
            <div className="relative border-2 border-amber-200 p-10">
              <div className="flex items-start gap-8">
                {/* Enhanced Heart Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-light text-black mb-2 uppercase tracking-[0.2em]">
                      WISHLIST BENEFITS
                    </h3>
                    <div className="w-12 h-px bg-amber-600"></div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-base mb-6">
                    Save your favorite items to receive exclusive notifications about price changes, new arrivals, and special offers. Your wishlist is private and secure.
                  </p>
                  
                  {/* Wishlist Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 uppercase tracking-wider font-medium">PRICE ALERTS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 uppercase tracking-wider font-medium">STOCK UPDATES</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 uppercase tracking-wider font-medium">EXCLUSIVE OFFERS</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-300 opacity-30"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-300 opacity-30"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
