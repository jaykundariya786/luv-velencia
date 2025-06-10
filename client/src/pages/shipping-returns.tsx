
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, RotateCcw, Shield, Clock, Package, Globe } from "lucide-react";

export default function ShippingReturns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              SHIPPING & RETURNS
            </h1>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            G
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            DELIVERY & RETURNS POLICY
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="text-gray-600 lv-body max-w-2xl mx-auto">
            Everything you need to know about our shipping options and return policy.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">SHIPPING OPTIONS</h3>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="lv-luxury font-bold text-primary text-sm mb-2">STANDARD SHIPPING</h4>
                <p className="text-gray-600 lv-body font-mono text-sm">5-7 business days • Free on orders over $100</p>
              </div>
              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="lv-luxury font-bold text-primary text-sm mb-2">EXPRESS SHIPPING</h4>
                <p className="text-gray-600 lv-body font-mono text-sm">2-3 business days • $15</p>
              </div>
              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="lv-luxury font-bold text-primary text-sm mb-2">NEXT DAY DELIVERY</h4>
                <p className="text-gray-600 lv-body font-mono text-sm">1 business day • $25</p>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">PROCESSING TIME</h3>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="lv-luxury font-bold text-primary text-sm mb-2">STANDARD ORDERS</h4>
                <p className="text-gray-600 lv-body font-mono text-sm">1-2 business days to process</p>
              </div>
              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="lv-luxury font-bold text-primary text-sm mb-2">CUSTOM ORDERS</h4>
                <p className="text-gray-600 lv-body font-mono text-sm">5-10 business days to process</p>
              </div>
              <div className="border-l-4 border-gray-200 pl-4">
                <h4 className="lv-luxury font-bold text-primary text-sm mb-2">HOLIDAY SEASONS</h4>
                <p className="text-gray-600 lv-body font-mono text-sm">Additional 1-2 days during peak times</p>
              </div>
            </div>
          </div>
        </div>

        {/* Returns Policy */}
        <div className="border-2 border-gray-200 rounded-3xl p-10 mb-16 bg-white">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h2 className="lv-luxury font-bold text-primary text-2xl text-black">
                RETURN POLICY
              </h2>
            </div>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="lv-luxury font-bold text-primary text-lg mb-6">RETURN WINDOW</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#197149] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 lv-body font-mono text-sm">
                    30 days from delivery date
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#197149] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 lv-body font-mono text-sm">
                    Items must be in original condition
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#197149] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 lv-body font-mono text-sm">
                    Tags must be attached
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="lv-luxury font-bold text-primary text-lg mb-6">RETURN PROCESS</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#197149] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 lv-body font-mono text-sm">
                    Initiate return online
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#197149] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 lv-body font-mono text-sm">
                    Print prepaid return label
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#197149] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 lv-body font-mono text-sm">
                    Package and ship items back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">INTERNATIONAL SHIPPING</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">Available to over 100 countries</p>
              <p className="text-gray-600 lv-body font-mono text-sm">7-14 business days delivery</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Duties and taxes may apply</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Minimum order $75</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">EXCHANGES</h3>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">Free size exchanges within 30 days</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Color exchanges subject to availability</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Same item exchanges only</p>
              <p className="text-gray-600 lv-body font-mono text-sm">One exchange per item</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-2 border-gray-200 rounded-3xl p-10 mb-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="space-y-8">
            <div className="border-l-4 border-[#197149] pl-6">
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">What if my item arrives damaged?</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Contact us immediately with photos of the damage. We'll arrange a replacement or full refund.
              </p>
            </div>
            
            <div className="border-l-4 border-[#197149] pl-6">
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">Can I return sale items?</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Yes, sale items can be returned within 30 days for store credit only.
              </p>
            </div>
            
            <div className="border-l-4 border-[#197149] pl-6">
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">How long do refunds take?</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Refunds are processed within 5-7 business days after we receive your return.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <div className="border-2 border-gray-200 rounded-3xl p-10 bg-white">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
              NEED HELP?
            </h2>
            <p className="text-gray-600 lv-body font-mono text-sm mb-8">
              Have questions about your order or need assistance with a return?
            </p>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-3 text-xs lv-luxury font-bold rounded-full transition-all duration-300 hover:scale-105"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
