
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import { ChevronDown, Plus, Minus, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactNumber: string;
  deliveryMethod: 'standard' | 'express';
  saveAddress: boolean;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useAppSelector(state => state.shoppingBag);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: 'jaykoundariya.ocean@gmail.com',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    contactNumber: '',
    deliveryMethod: 'standard',
    saveAddress: false
  });

  const [showShippingAddress, setShowShippingAddress] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const estimatedTax = 0;
  const total = subtotal + shipping + estimatedTax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout submission
    console.log('Checkout data:', { formData, items });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4 lv-luxury">Your bag is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors lv-luxury"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl md:text-5xl lv-luxury text-white tracking-[0.2em] drop-shadow-md">
              SECURE CHECKOUT
            </h1>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate('/shopping-bag')}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            C
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid Layout - Similar to Orders Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Checkout Form */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 px-6 py-6 border-b-2 border-gray-100">
              <h2 className="lv-luxury text-lg font-bold text-gray-900 mb-4">
                YOU ARE CHECKING OUT AS:
              </h2>
              <div className="bg-white/60 p-4 rounded-xl border border-gray-100">
                <p className="lv-body text-gray-700 font-mono text-sm">{formData.email}</p>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Address Section */}
                <div className={`border border-gray-200 rounded-lg ${showShippingAddress ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div 
                    onClick={() => setShowShippingAddress(!showShippingAddress)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 ${showShippingAddress ? 'bg-blue-600' : 'bg-gradient-to-r from-[#0b3e27] to-[#197149]'} text-white rounded-full flex items-center justify-center text-xs font-bold lv-luxury mr-3`}>
                        1
                      </div>
                      <h3 className="text-lg font-bold text-black lv-luxury">SHIPPING ADDRESS</h3>
                    </div>
                    {showShippingAddress ? (
                      <Minus className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>

                  {showShippingAddress && (
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      <p className="text-sm text-gray-600 lv-body">Where would we deliver to?</p>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="delivery" value="home" defaultChecked className="w-4 h-4" />
                            <span className="text-sm font-medium lv-luxury">Home Delivery</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="delivery" value="collect" className="w-4 h-4" />
                            <span className="text-sm font-medium lv-luxury">Collect in Store</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">FIRST NAME*</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">LAST NAME*</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-black mb-2 lv-luxury">ADDRESS LINE 1*</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">CITY*</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">STATE*</label>
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                              required
                            >
                              <option value="">Select State</option>
                              <option value="CA">California</option>
                              <option value="NY">New York</option>
                              <option value="TX">Texas</option>
                              <option value="FL">Florida</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury flex items-center">
                              ZIP CODE* <Info className="w-3 h-3 ml-1 text-gray-400" />
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-black mb-2 lv-luxury">CONTACT NUMBER*</label>
                          <div className="flex">
                            <select className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 lv-body">
                              <option value="+1">+1 US</option>
                            </select>
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleInputChange}
                              placeholder="Add contact number"
                              className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                              required
                            />
                          </div>
                          <label className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              name="saveAddress"
                              checked={formData.saveAddress}
                              onChange={handleInputChange}
                              className="w-4 h-4 mr-2"
                            />
                            <span className="text-sm text-gray-600 lv-body">Save shipping address information</span>
                          </label>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowShippingAddress(false);
                          setShowOrderDetails(true);
                        }}
                        className="w-full bg-gradient-to-r from-[#0b3e27] to-[#197149] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 lv-luxury"
                      >
                        CONTINUE TO PACKAGING
                      </Button>
                    </div>
                  )}
                </div>

                {/* Packaging Options Section */}
                <div className={`border border-gray-200 rounded-lg ${showOrderDetails ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div 
                    onClick={() => setShowOrderDetails(!showOrderDetails)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 ${showOrderDetails ? 'bg-blue-600' : 'bg-gradient-to-r from-[#0b3e27] to-[#197149]'} text-white rounded-full flex items-center justify-center text-xs font-bold lv-luxury mr-3`}>
                        2
                      </div>
                      <h3 className="text-lg font-bold text-black lv-luxury">PACKAGING OPTIONS & GIFTING</h3>
                    </div>
                    {showOrderDetails ? (
                      <Minus className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>

                  {showOrderDetails && (
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      <p className="text-sm text-gray-600 mb-6 lv-body">Choose your preferred packaging option</p>

                      {/* Packaging Options */}
                      <div className="space-y-3">
                        {/* Online Exclusive Tote */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <input 
                                type="radio" 
                                name="packaging" 
                                id="exclusive-tote" 
                                defaultChecked 
                                className="w-4 h-4 mt-1" 
                              />
                              <div className="flex-1">
                                <label htmlFor="exclusive-tote" className="font-medium text-sm cursor-pointer lv-luxury">
                                  Online Exclusive Tote
                                </label>
                                <p className="text-xs text-gray-600 mt-1 lv-body">
                                  Your item comes in our signature box with an online exclusive cotton tote.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <img 
                                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=60&h=60&fit=crop&crop=center" 
                                alt="Tote bag" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                              <img 
                                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&crop=center" 
                                alt="Shopping bag" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Signature Box */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <input 
                                type="radio" 
                                name="packaging" 
                                id="signature-box" 
                                className="w-4 h-4 mt-1" 
                              />
                              <div className="flex-1">
                                <label htmlFor="signature-box" className="font-medium text-sm cursor-pointer lv-luxury">
                                  Signature Box
                                </label>
                                <p className="text-xs text-gray-600 mt-1 lv-body">
                                  Your item comes in our signature box.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <img 
                                src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=60&h=60&fit=crop&crop=center" 
                                alt="Signature box" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                              <img 
                                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60&h=60&fit=crop&crop=center" 
                                alt="Luxury box" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Boutique Shopping Bag */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <input 
                                type="radio" 
                                name="packaging" 
                                id="boutique-bag" 
                                className="w-4 h-4 mt-1" 
                              />
                              <div className="flex-1">
                                <label htmlFor="boutique-bag" className="font-medium text-sm cursor-pointer lv-luxury">
                                  Boutique Shopping Bag
                                </label>
                                <p className="text-xs text-gray-600 mt-1 lv-body">
                                  Your item comes in our signature box with the shopping bag found in luxury stores.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <img 
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop&crop=center" 
                                alt="Boutique bag" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                              <img 
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop&crop=center" 
                                alt="Shopping bag" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 lv-body">
                        We will try to meet your preferences, but some options may not be suitable for all items. Product packaging may vary from the image(s) and include special protection or limited edition collection options.
                      </p>

                      {/* Additional Options */}
                      <div className="space-y-3 border-t border-gray-100 pt-3">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm lv-body">Remove price from invoice</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm lv-body">Add a Gift Message</span>
                        </label>
                      </div>

                      <Button
                        onClick={() => {
                          setShowOrderDetails(false);
                          setShowPaymentOptions(true);
                        }}
                        className="w-full bg-gradient-to-r from-[#0b3e27] to-[#197149] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 lv-luxury"
                      >
                        CONTINUE TO PAYMENT
                      </Button>
                    </div>
                  )}
                </div>

                {/* Payment Section */}
                <div className={`border border-gray-200 rounded-lg ${showPaymentOptions ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div 
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 ${showPaymentOptions ? 'bg-blue-600' : 'bg-gradient-to-r from-[#0b3e27] to-[#197149]'} text-white rounded-full flex items-center justify-center text-xs font-bold lv-luxury mr-3`}>
                        3
                      </div>
                      <h3 className="text-lg font-bold text-black lv-luxury">PAYMENT</h3>
                    </div>
                    {showPaymentOptions ? (
                      <Minus className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>

                  {showPaymentOptions && (
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      <p className="text-sm text-gray-600 lv-body">How would you like to pay?</p>

                      {/* Payment Method Tabs */}
                      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button className="flex-1 py-2 px-4 bg-blue-50 border-r border-gray-200 text-sm font-medium text-blue-700 lv-luxury">
                          Credit Card
                        </button>
                        <button className="flex-1 py-2 px-4 bg-gray-100 border-r border-gray-200 text-sm font-medium text-gray-600 lv-luxury">
                          PayPal
                        </button>
                        <button className="flex-1 py-2 px-4 bg-gray-100 text-sm font-medium text-gray-600 lv-luxury">
                          Affirm Monthly Payments
                        </button>
                      </div>

                      {/* Credit Card Form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">CREDIT CARD NUMBER</label>
                            <input
                              type="text"
                              placeholder="Enter your card number"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">SECURITY CODE</label>
                            <input
                              type="text"
                              placeholder="3 - 4 Digits"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">EXPIRATION DATE</label>
                            <div className="flex gap-2">
                              <select className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body">
                                <option>MM</option>
                                <option>01</option>
                                <option>02</option>
                                <option>03</option>
                                <option>04</option>
                                <option>05</option>
                                <option>06</option>
                                <option>07</option>
                                <option>08</option>
                                <option>09</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                              </select>
                              <select className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body">
                                <option>YYYY</option>
                                <option>2024</option>
                                <option>2025</option>
                                <option>2026</option>
                                <option>2027</option>
                                <option>2028</option>
                                <option>2029</option>
                                <option>2030</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-black mb-2 lv-luxury">NAME ON CARD</label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                            />
                          </div>
                        </div>

                        {/* Accepted Cards */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 lv-body">Accepted credit cards:</span>
                          <div className="flex gap-1">
                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                            <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                            <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AE</div>
                            <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">D</div>
                            <div className="w-8 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
                          </div>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-3 border-t border-gray-100 pt-3">
                          <label className="flex items-start gap-2">
                            <input type="checkbox" className="w-4 h-4 mt-0.5" />
                            <span className="text-sm lv-body">Save credit card information to wallet</span>
                          </label>
                          <label className="flex items-start gap-2">
                            <input type="checkbox" className="w-4 h-4 mt-0.5" defaultChecked />
                            <div className="text-sm lv-body">
                              <span>Billing Address and Phone are the same as Shipping Information</span>
                              <p className="text-xs text-gray-500 mt-1">
                                If the Billing Address and/or Billing Phone associated with your payment method are different, please uncheck this box.
                              </p>
                            </div>
                          </label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 lv-luxury"
                        >
                          PLACE ORDER
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden sticky top-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 px-6 py-6 border-b-2 border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black lv-luxury">ORDER SUMMARY</h2>
                <div className="flex items-center text-sm text-gray-600 lv-body">
                  <span className="mr-1">👜</span>
                  {items.length} ITEM{items.length !== 1 ? 'S' : ''}
                </div>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-gray-100">
                <span className="lv-luxury text-xs font-bold text-primary">Order #</span>
                <div className="lv-body text-gray-700 font-mono text-sm mt-1">#USCART412345045</div>
              </div>
            </div>

            <div className="p-6">
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden shadow-md border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="lv-luxury text-xs font-bold text-gray-900 truncate mb-2">{item.name}</h4>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 lv-body">Style #{item.id} • Size {item.size}</p>
                        <p className="text-xs text-gray-600 lv-body">Color: {item.color}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-600 lv-body">QTY: {item.quantity}</span>
                          <span className="lv-luxury text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-4 border-t-2 border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 lv-body">Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-black lv-luxury">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 lv-body">Shipping</span>
                  <span className="font-semibold text-green-600 lv-luxury">Free (Next Business Day)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 lv-body">Estimated Tax</span>
                  <span className="font-semibold text-black lv-luxury">${estimatedTax.toFixed(2)}</span>
                </div>
                
                {/* Total */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">ESTIMATED TOTAL</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    Including all taxes and fees
                  </p>
                </div>
              </div>

              

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 lv-body">
                  You will be charged at the time of shipment. If for some reason we are unable to process your purchase, you will be contacted.
                </p>
              </div>

              <div className="mt-6 space-y-2 text-center">
                <p className="text-xs font-semibold text-black lv-luxury">📞 1-877-482-5432</p>
                <p className="text-xs text-blue-600 underline lv-body">clientservice@luxury.com | Need help?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
