import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateQuantity, removeItem } from "@/store/slices/shoppingBagSlice";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag as ShoppingBagIcon, Heart, Printer, Calculator, Phone, Mail, ChevronDown, MapPin, Truck, Clock, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ShoppingBag() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.shoppingBag);

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleUpdateQuantity = (id: number, size: string, quantity: number) => {
    dispatch(updateQuantity({ id, size, quantity }));
  };

  const handleRemoveItem = (id: number, size: string) => {
    dispatch(removeItem({ id, size }));
  };

  const [zipCode, setZipCode] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState("premium");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = 0; // Will be calculated
  const total = subtotal + shipping + tax;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const shippingOptions = [
    { label: "Premium Express (Free)", value: "premium", price: 0, icon: "⚡", time: "Next Day" },
    { label: "Collect In-Store", value: "store", price: 0, icon: "🏪", time: "Same Day" },
    { label: "Next Business Day", value: "next", price: 25, icon: "📦", time: "1-2 Days" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-2xl px-4">
            <ShoppingBagIcon className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl md:text-6xl font-light uppercase tracking-[0.2em] mb-4">
              Shopping Bag
            </h1>
            <div className="w-24 h-px bg-white/60 mx-auto mb-4"></div>
            <p className="text-lg text-white/80 font-light">
              {items.length === 0 ? "Your luxury collection awaits" : `${items.length} item${items.length > 1 ? 's' : ''} in your bag`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-light mb-4 text-gray-900">Your bag is empty</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Discover our exquisite collections of luxury items and start building your personal style
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg uppercase tracking-wider font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Collections
              </Button>
            </div>
          </div>
        ) : (
          /* Items Layout */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Items */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Your Selections ({items.length} item{items.length > 1 ? 's' : ''})
                      </h2>
                      <p className="text-sm text-gray-600">
                        Review and modify your luxury items
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/print-shopping-bag')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-white rounded-lg transition-colors border border-gray-200"
                    >
                      <Printer className="w-4 h-4" />
                      Print Bag
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-8">
                  <div className="space-y-8">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${item.size}`} className={`${index !== items.length - 1 ? 'border-b border-gray-100 pb-6 mb-6' : ''}`}>
                        {/* Mobile Layout */}
                        <div className="block md:hidden">
                          <div className="flex gap-4">
                            {/* Mobile Product Image - Smaller */}
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Mobile Content */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-base text-gray-900 leading-tight line-clamp-2 mb-1">
                                  {item.name}
                                </h3>
                                <div className="space-y-0.5 text-xs text-gray-600">
                                  <p><span className="font-medium">Style:</span> {item.style}</p>
                                  <p><span className="font-medium">Size:</span> {item.size}</p>
                                </div>
                              </div>
                              
                              {/* Mobile Price and Quantity Row */}
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-3 py-2 text-sm font-medium min-w-[40px] text-center bg-gray-50">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Mobile Status */}
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-green-800">IN STOCK</span>
                              </div>
                              
                              {/* Mobile Actions */}
                              <div className="flex gap-4 text-xs">
                                <button className="text-blue-600 hover:text-blue-800 underline font-medium">
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleRemoveItem(item.id, item.size)}
                                  className="text-red-600 hover:text-red-800 underline font-medium"
                                >
                                  Remove
                                </button>
                                <button className="text-gray-600 hover:text-gray-800 underline font-medium flex items-center gap-1">
                                  <Heart className="w-2.5 h-2.5" />
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:grid md:grid-cols-4 gap-6">
                          {/* Desktop Product Image */}
                          <div className="w-full h-32 md:h-40 lg:aspect-square bg-gray-50 rounded-xl overflow-hidden group">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Desktop Product Details */}
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-2 leading-tight">
                                {item.name}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><span className="font-medium">Style:</span> {item.style}</p>
                                <p><span className="font-medium">Color:</span> Light blue GG denim</p>
                                <p><span className="font-medium">Size:</span> {item.size}</p>
                              </div>
                            </div>

                            {/* Desktop Availability Status */}
                            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-green-800">IN STOCK</span>
                            </div>

                            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-4 h-4" />
                                <span className="font-medium">Free delivery or collect in store</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>30-day return policy</span>
                              </div>
                            </div>

                            {/* Desktop Actions */}
                            <div className="flex flex-wrap gap-4">
                              <button className="text-sm text-blue-600 hover:text-blue-800 underline font-medium">
                                Edit Item
                              </button>
                              <button 
                                onClick={() => handleRemoveItem(item.id, item.size)}
                                className="text-sm text-red-600 hover:text-red-800 underline font-medium"
                              >
                                Remove
                              </button>
                              <button className="text-sm text-gray-600 hover:text-gray-800 underline font-medium flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                Save for Later
                              </button>
                            </div>
                          </div>

                          {/* Desktop Price and Quantity */}
                          <div className="space-y-6">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-sm text-gray-500">
                                  {formatPrice(item.price)} each
                                </div>
                              )}
                            </div>

                            {/* Desktop Quantity Controls */}
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-gray-600 mb-2 font-medium">Quantity</span>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-6 py-3 text-lg font-medium min-w-[60px] text-center bg-gray-50">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="p-3 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="xl:sticky xl:top-8 h-fit">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6">
                  <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                  <p className="text-xs text-gray-300 font-mono bg-white/10 px-3 py-1 rounded-full inline-block">
                    #USCART412345045
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                      <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  {/* Shipping Section */}
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Shipping Options</span>
                    </div>

                    {/* Zip Code Input */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>Check delivery options for your area:</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter ZIP code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="flex-1 h-11 border-gray-300 focus:border-blue-500"
                        />
                        <Button 
                          variant="outline" 
                          className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 h-11 px-6 font-medium"
                        >
                          CHECK
                        </Button>
                      </div>
                    </div>

                    {/* Shipping Options */}
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <div 
                          key={option.value}
                          className={`flex justify-between items-center p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                            selectedShipping === option.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedShipping(option.value)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{option.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {option.time}
                              </div>
                            </div>
                          </div>
                          <span className={`font-bold text-sm ${option.price === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                            {option.price === 0 ? 'FREE' : `$${option.price}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-gray-600">Estimated Tax</span>
                    <button className="text-blue-600 hover:text-blue-800 underline font-medium text-sm">
                      Calculate
                    </button>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-900 text-white p-5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-2xl font-bold">{formatPrice(total)}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">
                      Including all taxes and fees
                    </p>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full bg-black text-white hover:bg-gray-800 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                      🔒 Secure Checkout
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm text-gray-500 font-medium">Or pay with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-12 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all rounded-xl"
                      >
                        <span className="font-bold text-blue-800">Pay</span>
                        <span className="font-bold text-blue-600">Pal</span>
                      </Button>

                      <Button 
                        variant="outline" 
                        className="h-12 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all rounded-xl"
                      >
                        <span className="font-bold text-gray-800">amazon</span>
                        <span className="text-orange-500 ml-1">pay</span>
                      </Button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 text-green-800">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Secure & Protected</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Need Assistance?
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Call us</span>
                    <span className="font-medium">+1.877.482.2430</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-xs">support@luvvencencia.com</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center pt-2">
                    Customer service available 24/7
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}