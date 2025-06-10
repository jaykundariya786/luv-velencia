
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription signup
    console.log('Subscription signup:', { plan, formData });
    // Redirect to success page or account
    navigate('/account');
  };

  if (!plan) {
    navigate('/subscription-plans');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/subscription-plans')}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 lv-luxury">
              Order Summary
            </h2>
            
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black lv-luxury">
                  {plan.name} Plan
                </h3>
                <span className="text-2xl font-bold text-black lv-luxury">
                  ${plan.price}/month
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 lv-body">{feature}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <p className="text-sm text-gray-500 lv-body">
                    + {plan.features.length - 3} more benefits
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 lv-body">Monthly Subscription</span>
                <span className="font-semibold text-black lv-luxury">${plan.price}.00</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 lv-body">Tax</span>
                <span className="font-semibold text-black lv-luxury">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span className="text-black lv-luxury">Total</span>
                <span className="text-black lv-luxury">${plan.price}.00</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 lv-luxury text-sm">
                  Secure Payment
                </span>
              </div>
              <p className="text-green-700 lv-body text-xs">
                Your payment information is encrypted and secure. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6 lv-luxury">
              Payment Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                    First Name
                  </label>
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
                  <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                    Last Name
                  </label>
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
                <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                  <CreditCard className="inline w-4 h-4 mr-2" />
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                  Billing Address
                </label>
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent lv-body"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                    City
                  </label>
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
                  <label className="block text-sm font-semibold text-black mb-2 lv-luxury">
                    ZIP Code
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

              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors lv-luxury"
              >
                Subscribe to {plan.name} Plan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
