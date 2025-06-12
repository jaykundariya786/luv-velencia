
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateQuantity, removeItem } from "@/store/slices/shoppingBagSlice";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag as ShoppingBagIcon, Heart, Printer, Calculator, Phone, Mail, ChevronDown, MapPin, Truck, Clock, Shield, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section - Similar to Orders Page */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBagIcon className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-3xl md:text-5xl lv-luxury text-white tracking-[0.2em] drop-shadow-md">
              SHOPPING BAG
            </h1>
            <div className="w-24 h-px bg-white/60 mx-auto mb-4 mt-4"></div>
            <p className="text-lg text-white/80 font-light">
              {items.length === 0 ? "Your luxury collection awaits" : `${items.length} item${items.length > 1 ? 's' : ''} in your bag`}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            S
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          /* Empty State - Updated Design */
          <div className="text-center py-24">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl md:text-5xl lv-luxury text-primary tracking-[0.2em] drop-shadow-2xl">
              Your Bag is Empty
            </h3>
            <p className="text-md md:text-xl my-8 lv-elegant delay-200 max-w-2xl mx-auto font-mono leading-relaxed">
              Discover our exquisite collection of luxury items and start your shopping journey.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="lv-luxury font-bold text-primary rounded-full items-center justify-center bg-primary hover:shadow-xl transition-all h-10 uppercase text-sm text-white px-12 py-6"
            >
              Explore Collection
            </Button>
          </div>
        ) : (
          /* Grid Layout - Products on Left, Order Summary on Right */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Products */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:border-gray-100 transition-all duration-500"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 bg-white rounded-xl flex-shrink-0 overflow-hidden shadow-md border border-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="lv-luxury text-lg font-bold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-4">
                                <span className="text-gray-500">Style:</span>
                                <span className="text-gray-700 font-medium">{item.style || 'Classic Collection'}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-500">Size:</span>
                                <span className="text-gray-700 font-medium">{item.size}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-800">IN STOCK</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.price)} each
                              </div>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-4">Qty:</span>
                            <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-lg font-bold min-w-[50px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 text-gray-700 hover:bg-primary/10 text-primary hover:border-primary rounded-full font-bold transition-all duration-300 flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4" />
                            Save
                          </Button>
                          <Button
                            onClick={() => navigate('/print-shopping-bag')}
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden sticky top-8">
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
                        <span>Enter ZIP code:</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="ZIP code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="flex-1 h-10 border-gray-300 focus:border-blue-500 text-sm"
                        />
                        <Button 
                          variant="outline" 
                          className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 h-10 px-4 font-medium text-sm"
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
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{option.icon}</span>
                            <div>
                              <div className="font-medium text-xs">{option.label}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {option.time}
                              </div>
                            </div>
                          </div>
                          <span className={`font-bold text-xs ${option.price === 0 ? 'text-green-600' : 'text-gray-700'}`}>
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
                    <Button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-gradient-to-r from-[#0b3e27] to-[#197149] text-white hover:shadow-xl h-12 text-lg font-semibold transition-all duration-300 rounded-xl"
                    >
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
                        className="h-10 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all rounded-xl text-sm"
                      >
                        <span className="font-bold text-blue-800">Pay</span>
                        <span className="font-bold text-blue-600">Pal</span>
                      </Button>

                      <Button 
                        variant="outline" 
                        className="h-10 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all rounded-xl text-sm"
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
            </div>
          </div>
        )}

        {/* Help Section */}
        {items.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
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
        )}

        {/* Services Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="lv-luxury mb-4 text-md font-bold text-primary">
              Free Shipping
            </h4>
            <p className="lv-body text-gray-500 text-xs font-mono lv-transition">
              Complimentary shipping on all orders with express delivery options available.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="lv-luxury mb-4 text-md font-bold text-primary">
              Secure Payment
            </h4>
            <p className="lv-body text-gray-500 text-xs font-mono lv-transition">
              Your payment information is protected with industry-leading encryption technology.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
            <h4 className="lv-luxury mb-4 text-md font-bold text-primary">
              Premium Service
            </h4>
            <p className="lv-body text-gray-500 text-xs font-mono lv-transition">
              Dedicated customer support and personalized shopping assistance available 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
