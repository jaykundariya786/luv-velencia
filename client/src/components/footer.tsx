import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-lv-brown text-lv-cream py-16 bg-gray-100">
      <div className="max-w-7xl  mx-auto px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lv-fade-in delay-200">
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Quick Links
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/services')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                Services
              </button>
              <button
                onClick={() => navigate('/about')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                About LUV VENCENCIA
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                FAQ
              </button>
              <button
                onClick={() => navigate('/product-care')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                Product Care
              </button>
              <button
                onClick={() => navigate('/gift-services')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                Gift Services
              </button>
            </div>
          </div>

          {/* Customer Care */}
          <div className="lv-fade-in delay-100">
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Customer Care
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/contact')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate('/size-guide')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                Size Guide
              </button>
              <button
                onClick={() => navigate('/shipping-returns')}
                className="block lv-luxury text-md font-bold text-primary hover:text-black transition-colors cursor-pointer text-left"
              >
                Shipping & Returns
              </button>
            </div>
          </div>

          {/* Newsletter & Subscription */}
          <div>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Membership
            </h3>
            <p className="lv-body text-gray-500 hover:text-primary font-mono lv-transition mb-4">
              Be the first to know about new arrivals and exclusive events.
            </p>
            <button
              onClick={() => navigate('/subscription-plans')}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors lv-luxury text-sm font-semibold"
            >
              View Subscription Plans
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="lv-luxury mb-4 text-xs font-bold text-primary">
              © 2025 LUV VENCENCIA - All rights reserved.
            </div>
            <div className="flex flex-wrap text-xs gap-4">
              <button
                onClick={() => navigate('/privacy-policy')}
                className="lv-luxury text-xs font-bold text-primary hover:text-black transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/cookie-policy')}
                className="lv-luxury text-xs font-bold text-primary hover:text-black transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
              <button
                onClick={() => navigate('/terms-of-use')}
                className="lv-luxury text-xs font-bold text-primary hover:text-black transition-colors cursor-pointer"
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
