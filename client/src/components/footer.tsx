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
              <a
                href="/services"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Services
              </a>
              <a
                href="/about"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                About LUV VENCENCIA
              </a>
              <a
                href="/faq"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                FAQ
              </a>
              <a
                href="/product-care"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Product Care
              </a>
              <a
                href="/gift-services"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Gift Services
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div className="lv-fade-in delay-100">
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Customer Care
            </h3>
            <div className="space-y-2">
              <a
                href="/contact"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Contact Us
              </a>
              <a
                href="/size-guide"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Size Guide
              </a>
              <a
                href="/shipping-returns"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Shipping & Returns
              </a>
            </div>
          </div>

          {/* Newsletter & Subscription */}
          <div>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Membership
            </h3>
            <a
              href="/subscription-plans"
              className="lv-body text-gray-500 hover:text-primary font-mono lv-transition mb-4"
            >
              Be the first to know about new arrivals and exclusive events.
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="lv-luxury mb-4 text-xs font-bold text-primary">
              © 2025 LUV VENCENCIA - All rights reserved.
            </div>
            <div className="flex flex-wrap text-xs gap-4">
              <a
                href="/privacy-policy"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Privacy Policy
              </a>
              <a
                href="/cookie-policy"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Cookie Policy
              </a>
              <a
                href="/terms-of-use"
                className="lv-body text-gray-500 hover:text-primary font-mono lv-transition  block transition-colors cursor-pointer text-left"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
