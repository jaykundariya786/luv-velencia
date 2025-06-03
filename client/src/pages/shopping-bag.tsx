
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingBagContext } from "../contexts/shopping-bag-context";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag as ShoppingBagIcon, Heart, Printer, Calculator, Phone, Mail, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ShoppingBag() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useShoppingBagContext();
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
    { label: "Free (Premium Express)", value: "premium", price: 0 },
    { label: "Next Business Day", value: "next", price: 25 },
    { label: "Collect In-Store Next Business Day", value: "store", price: 0 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src="https://media.gucci.com/content/HeroStandard_2400x800/1677676302/001_HP_SpringSummer2023_Ancora_3.jpg"
          alt="Shopping Bag Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider mb-4">
              Shopping Bag
            </h1>
            <div className="w-16 h-px bg-white mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-6" />
            <h2 className="text-xl font-light mb-4">Your shopping bag is empty</h2>
            <p className="text-gray-500 mb-8">
              Discover our latest collections and add items to your bag
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 uppercase tracking-wider"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          /* Items Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Items and Actions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header with Print */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-wider text-gray-600">
                    Your Selections
                  </h2>
                </div>
                <button 
                  onClick={() => navigate('/print-shopping-bag')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="border-b border-gray-200 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-50 rounded overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="font-medium text-lg uppercase tracking-wide">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Style: {item.style}
                          </p>
                          <p className="text-sm text-gray-600">
                            Variation: Light blue GG denim
                          </p>
                          <p className="text-sm text-gray-600">
                            Size: {item.size}
                          </p>
                        </div>

                        {/* Availability */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-600">AVAILABLE</p>
                          <p className="text-xs text-gray-500">
                            Enjoy complimentary delivery or collect in store
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <button className="underline hover:no-underline">EDIT</button>
                          <button 
                            onClick={() => removeItem(item.id, item.size)}
                            className="underline hover:no-underline"
                          >
                            REMOVE
                          </button>
                          <button className="underline hover:no-underline">SAVED ITEMS</button>
                        </div>
                      </div>

                      {/* Price and Quantity */}
                      <div className="space-y-4">
                        <div className="text-lg font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-2 text-sm min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white border border-gray-200 p-6 space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider">
                    Order Summary
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">USCART412345045</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {/* Shipping Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <div className="relative">
                        <Select value={selectedShipping} onValueChange={setSelectedShipping}>
                          <SelectTrigger className="w-48 h-8 text-xs border-blue-400 text-blue-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {shippingOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-xs">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      See the shipping options available to you:
                    </div>

                    {/* Zip Code Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a Zip code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="flex-1 h-8 text-xs"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-black text-white hover:bg-gray-800 text-xs px-4 h-8"
                      >
                        CALCULATE
                      </Button>
                    </div>

                    {/* Shipping Options List */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Premium Express</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collect In-Store Next Business Day</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Business Day</span>
                        <span>$ 25</span>
                      </div>
                    </div>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <button className="text-xs underline text-blue-600">Calculate</button>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between font-medium text-base pt-4 border-t border-gray-200">
                    <span>Estimated Total</span>
                    <span className="text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* View Details Expandable */}
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => toggleSection('details')}
                    className="w-full flex items-center justify-between text-left text-sm font-medium uppercase tracking-wider"
                  >
                    View Details
                    <span className="text-lg">{expandedSection === 'details' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'details' && (
                    <div className="pt-4 text-xs text-gray-600">
                      <p>
                        You will be charged at the time of shipment. If this is a 
                        personalized or made-to-order purchase, you will be 
                        charged at the time of purchase.
                      </p>
                    </div>
                  )}
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3 pt-4">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 uppercase tracking-wider text-sm font-medium">
                    Checkout
                  </Button>

                  <div className="text-center text-xs text-gray-500">OR</div>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-700">PAY WITH</span>
                      <div className="flex items-center">
                        <span className="font-bold text-blue-800">Pay</span>
                        <span className="font-bold text-blue-600">Pal</span>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-700">PAY WITH</span>
                      <span className="font-bold text-gray-800">amazon</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Expandable Sections */}
              <div className="space-y-4">
                {/* May We Help */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('help')}
                    className="w-full flex items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    May We Help?
                    <span className="text-lg">{expandedSection === 'help' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'help' && (
                    <div className="pb-4 space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>+1.877.482.2430</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>questions@us-online.gucci.com</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Options */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('payment')}
                    className="w-full flex items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Payment Options
                    <span className="text-lg">{expandedSection === 'payment' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'payment' && (
                    <div className="pb-4">
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div className="flex items-center justify-center p-2 border rounded">PayPal</div>
                        <div className="flex items-center justify-center p-2 border rounded">Visa</div>
                        <div className="flex items-center justify-center p-2 border rounded">MC</div>
                        <div className="flex items-center justify-center p-2 border rounded">Amex</div>
                        <div className="flex items-center justify-center p-2 border rounded">Discover</div>
                        <div className="flex items-center justify-center p-2 border rounded">Apple Pay</div>
                        <div className="flex items-center justify-center p-2 border rounded">JCB</div>
                        <div className="flex items-center justify-center p-2 border rounded">UnionPay</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Options */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('shipping')}
                    className="w-full flex items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Shipping Options
                    <span className="text-lg">{expandedSection === 'shipping' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'shipping' && (
                    <div className="pb-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Collect In-Store</div>
                          <div className="text-gray-500">Next Business Day</div>
                        </div>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Premium</div>
                          <div className="text-gray-500">Overnight</div>
                        </div>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Next Business Day</div>
                        </div>
                        <span>$ 25</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        * Standard not available in Alaska, Hawaii and Puerto Rico
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* In Stock Info */}
              <div className="bg-gray-50 p-4 text-center border border-gray-200">
                <div className="text-sm text-gray-600 mb-2">In Stock</div>
                <div className="text-lg font-medium">{formatPrice(subtotal)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
